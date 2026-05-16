using System.Linq.Expressions;
using DoAnTotNghiep.API.Common.Enums;

namespace DoAnTotNghiep.API.Common.Queries.Interface;

/// <summary>
/// Fluent builder để xây dựng IQueryable động cho EF Core.
/// 
/// THIẾT KẾ: Mỗi method trả về IQueryable thay vì IQueryBuilder vì:
///   - Cho phép caller tự quyết định có chain tiếp hay không
///   - Tương thích trực tiếp với LINQ extension methods (.ToList, .Count, v.v.)
///   - Phù hợp pattern stateless — không giữ state bên trong builder
/// 
/// PATTERN SỬ DỤNG:
///   var query = new EfQueryBuilder&lt;User&gt;(dbSet.AsQueryable());
///   var result = query
///       .WithKeyword("abc", "Name", "Email")
///       .WithFilter(request.Filters)
///       .WithSort("CreatedAt", "desc")
///       .WithPagination(1, 20)
///       .Build();
/// </summary>
public interface IQueryBuilder<T>
{
    /// <summary>
    /// Tìm kiếm từ khóa trên nhiều cột bằng OR — WHERE col1 LIKE '%kw%' OR col2 LIKE '%kw%'
    ///
    /// INPUT:
    ///   keyword (string?)      — Từ khóa cần tìm. Null/empty → bỏ qua, trả nguyên query.
    ///   fields  (string[])     — Tên các property cần tìm kiếm.
    ///                            Hỗ trợ nested: "Team.Name", "Address.City"
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã thêm điều kiện WHERE ... LIKE ...
    ///                   Nếu keyword rỗng hoặc fields rỗng → trả nguyên query gốc.
    ///
    /// TẠI SAO string[] fields thay vì Expression&lt;Func&lt;T, string&gt;&gt;[] ?
    ///   ✅ string[]  → map thẳng từ HTTP request (?searchFields=Name,Email)
    ///   ✅ string[]  → hỗ trợ nested "Team.Name" dễ dàng, không cần viết x => x.Team.Name
    ///   ✅ string[]  → dynamic lúc runtime, không cần biết T tại compile time
    ///   ❌ Expression → không thể deserialize từ JSON/query string
    ///   ❌ Expression → nested phải viết thủ công từng level
    ///
    /// VÍ DỤ:
    ///   .WithKeyword("nguyen", "FullName", "Email", "Department.Name")
    ///   → WHERE FullName LIKE '%nguyen%'
    ///      OR   Email    LIKE '%nguyen%'
    ///      OR   Department.Name LIKE '%nguyen%'
    /// </summary>
    IQueryable<T> WithKeyword(string? keyword, params string[] fields);

    /// <summary>
    /// Lọc đơn giản từ Dictionary key-value — thường map trực tiếp từ HTTP query string.
    /// Key hỗ trợ suffix operator: fieldName_{op}
    ///
    /// INPUT:
    ///   filter (Dictionary&lt;string, string?&gt;) — Cặp field-value cần lọc.
    ///     Key format:
    ///       "fieldName"       → mặc định dùng toán tử =  (Eq)
    ///       "fieldName_gte"   → >=
    ///       "fieldName_lte"   → &lt;=
    ///       "fieldName_gt"    → >
    ///       "fieldName_lt"    → &lt;
    ///       "fieldName_like"  → LIKE %value%
    ///       "fieldName_in"    → IN (1,2,3) — value là chuỗi "1,2,3"
    ///       "fieldName_btw"   → BETWEEN — value là "min,max"
    ///       "fieldName_neq"   → !=
    ///     Value null/empty    → bỏ qua field đó.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã append tất cả điều kiện WHERE bằng AND.
    ///
    /// TẠI SAO Dictionary&lt;string, string?&gt; thay vì object hoặc FilterCondition[] ?
    ///   ✅ Dictionary&lt;string, string?&gt; → map 1-1 với IQueryCollection của ASP.NET
    ///      request.Query.ToDictionary(k => k.Key, v => v.Value.ToString())
    ///   ✅ Không cần model riêng ở tầng Controller — giảm boilerplate
    ///   ✅ string? value → dễ validate null/empty trước khi xử lý
    ///   ❌ object → phải dùng reflection để đọc property, không rõ ràng
    ///   ❌ FilterCondition[] → overkill cho filter đơn giản từ query string
    ///
    /// VÍ DỤ:
    ///   GET /users?status=Active&amp;age_gte=18&amp;age_lte=30&amp;name_like=Nguyen
    ///   .WithFilter(new Dictionary&lt;string, string?&gt; {
    ///       ["status"]   = "Active",
    ///       ["age_gte"]  = "18",
    ///       ["age_lte"]  = "30",
    ///       ["name_like"]= "Nguyen"
    ///   })
    ///   → WHERE status = 'Active' AND age >= 18 AND age &lt;= 30 AND name LIKE '%Nguyen%'
    /// </summary>
    IQueryable<T> WithFilter(Dictionary<string, string?> filter);

    /// <summary>
    /// Lọc nâng cao type-safe — dùng khi logic filter đến từ Service/Business layer,
    /// không phải từ HTTP request.
    ///
    /// INPUT:
    ///   conditions (IEnumerable&lt;FilterCondition&gt;) — Danh sách điều kiện filter.
    ///     FilterCondition gồm:
    ///       Field    (string)         — Tên property, hỗ trợ nested "Team.Name"
    ///       Operator (FilterOperator) — Enum: Eq, Neq, Gt, Gte, Lt, Lte,
    ///                                         Like, In, Between, IsNull, IsNotNull
    ///       Value    (object?)        — Giá trị so sánh, đã đúng type (int, decimal, v.v.)
    ///       ValueTo  (object?)        — Chỉ dùng khi Operator = Between (giá trị upper bound)
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã append tất cả conditions bằng AND.
    ///
    /// TẠI SAO IEnumerable&lt;FilterCondition&gt; thay vì Dictionary&lt;string, string?&gt; ?
    ///   ✅ Value là object? → giữ đúng type (decimal, DateTime, Guid) không mất qua string
    ///   ✅ FilterOperator là enum → không bị typo như "gte", "lte" string
    ///   ✅ ValueTo → hỗ trợ Between rõ ràng, Dictionary không biểu diễn được
    ///   ✅ IsNull / IsNotNull → không có value, Dictionary không map được
    ///   ❌ Dictionary → mọi value đều là string → phải parse lại, mất type
    ///
    /// VÍ DỤ:
    ///   .WithCondition(new[] {
    ///       new FilterCondition { Field="Price",     Operator=Gte,     Value=1_000_000m },
    ///       new FilterCondition { Field="Price",     Operator=Between, Value=1_000_000m, ValueTo=2_000_000m },
    ///       new FilterCondition { Field="DeletedAt", Operator=IsNull                    },
    ///       new FilterCondition { Field="Id",        Operator=In,      Value=new[]{1,2,3} },
    ///   })
    /// </summary>
    IQueryable<T> WithCondition(IEnumerable<FilterCondition> conditions);

    /// <summary>
    /// Lọc theo khoảng thời gian — WHERE field >= from AND field &lt;= to
    /// Tự động xử lý toDate = cuối ngày (23:59:59.9999999).
    ///
    /// INPUT:
    ///   field    (string)    — Tên property DateTime, hỗ trợ nested "Audit.CreatedAt"
    ///   fromDate (DateTime?) — Ngày bắt đầu (inclusive). Null → bỏ qua lower bound.
    ///   toDate   (DateTime?) — Ngày kết thúc (inclusive, tự set về cuối ngày).
    ///                          Null → bỏ qua upper bound.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã thêm điều kiện date range.
    ///   Cả 2 null → trả nguyên query gốc.
    ///
    /// TẠI SAO string field thay vì Expression&lt;Func&lt;T, DateTime&gt;&gt; ?
    ///   ✅ string → map từ request (?dateField=CreatedAt&amp;from=...&amp;to=...)
    ///   ✅ string → dùng chung 1 method cho CreatedAt, UpdatedAt, DeletedAt, v.v.
    ///   ❌ Expression&lt;Func&lt;T, DateTime&gt;&gt; → không nhận Nullable DateTime? được
    ///      phải overload thêm Expression&lt;Func&lt;T, DateTime?&gt;&gt;
    ///   ❌ Expression → caller phải biết trước field lúc compile time
    ///
    /// TẠI SAO không gộp vào WithFilter ?
    ///   WithDate xử lý đặc biệt: tự set toDate về 23:59:59 để không bỏ sót
    ///   record trong ngày — WithFilter không làm điều này.
    ///
    /// VÍ DỤ:
    ///   .WithDate("CreatedAt", DateTime.Today.AddDays(-7), DateTime.Today)
    ///   → WHERE CreatedAt >= '2024-01-08 00:00:00'
    ///       AND CreatedAt &lt;= '2024-01-15 23:59:59.9999999'
    /// </summary>
    IQueryable<T> WithDate(string field, DateTime? fromDate, DateTime? toDate);

    /// <summary>
    /// Sắp xếp động — hỗ trợ multi-sort bằng cách gọi nhiều lần hoặc chuỗi "field dir".
    ///
    /// INPUT:
    ///   sortBy        (string?) — Tên field cần sort. Null/empty → bỏ qua, giữ thứ tự DB.
    ///                             Multi-sort: "Name asc, CreatedAt desc"
    ///   sortDirection (string?) — "asc" (mặc định) hoặc "desc". Case-insensitive.
    ///                             Bị override nếu sortBy đã chứa direction.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã có ORDER BY.
    ///   Lần gọi đầu → OrderBy / OrderByDescending
    ///   Lần gọi sau → ThenBy / ThenByDescending (nếu query đã là IOrderedQueryable)
    ///
    /// TẠI SAO string sortDirection thay vì bool isDescending ?
    ///   ✅ string "asc"/"desc" → map trực tiếp từ ?sortDir=desc trên URL
    ///   ✅ Không cần parse ở Controller trước khi truyền vào
    ///   ❌ bool isDescending → phải parse "desc" → true ở Controller, thêm boilerplate
    ///
    /// TẠI SAO không dùng Expression&lt;Func&lt;T, object&gt;&gt; keySelector ?
    ///   ✅ string → sortBy có thể đến từ query string, config, hoặc frontend
    ///   ❌ Expression → phải hardcode field lúc compile, không dynamic được
    ///
    /// VÍ DỤ:
    ///   .WithSorting("CreatedAt", "desc")
    ///   → ORDER BY CreatedAt DESC
    ///
    ///   .WithSorting("Name asc, Age desc")
    ///   → ORDER BY Name ASC, Age DESC
    /// </summary>
    IQueryable<T> WithSorting(string? sortBy, string? sortDirection = "asc");

    /// <summary>
    /// Eager load các navigation property — EF Core .Include()
    ///
    /// INPUT:
    ///   includes (string[]) — Tên các navigation property cần load.
    ///                         Hỗ trợ chuỗi ThenInclude: "Orders.Items.Product"
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã có JOIN tương ứng.
    ///
    /// TẠI SAO string[] thay vì Expression&lt;Func&lt;T, object&gt;&gt;[] ?
    ///   ✅ string[] → EF Core hỗ trợ .Include(string) với chuỗi nested "Orders.Items"
    ///      Expression chỉ support 1 level: x => x.Orders, sau đó phải .ThenInclude()
    ///   ✅ string[] → có thể đến từ config, attribute, hoặc request
    ///   ✅ string[] → ngắn gọn hơn khi có nhiều includes
    ///   ❌ Expression → nested buộc phải chain .ThenInclude() riêng,
    ///      không thể nhét vào params array chung
    ///
    /// VÍ DỤ:
    ///   .WithIncludes("Orders", "Orders.Items", "Address")
    ///   → EF sinh: LEFT JOIN Orders ... LEFT JOIN Items ... LEFT JOIN Address ...
    /// </summary>
    IQueryable<T> WithIncludes(params string[] includes);

    /// <summary>
    /// Thêm điều kiện WHERE tùy ý dạng strongly-typed Expression.
    /// Dùng khi logic quá phức tạp để biểu diễn qua Dictionary hay FilterCondition.
    ///
    /// INPUT:
    ///   expression (Expression&lt;Func&lt;T, bool&gt;&gt;) — Predicate bất kỳ.
    ///     Không được null. EF Core sẽ translate sang SQL.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã append thêm điều kiện WHERE bằng AND.
    ///
    /// TẠI SAO giữ method này dù đã có WithFilter và WithCondition ?
    ///   ✅ Expression → compile-time safe, refactor tên property → báo lỗi ngay
    ///   ✅ Biểu diễn được logic phức tạp: x => x.Orders.Any(o => o.Total > 1_000_000)
    ///   ✅ Không thể viết subquery/Any/All qua Dictionary hay FilterCondition
    ///   → Ba method bổ sung nhau, không thay thế nhau
    ///
    /// VÍ DỤ:
    ///   // Lọc user có ít nhất 2 số điện thoại
    ///   .Where(x => x.Phones.Count >= 2)
    ///
    ///   // Lọc nhà cung cấp có tổng nhập hàng > 1 tỷ
    ///   .Where(x => x.Imports.Sum(i => i.TotalValue) > 1_000_000_000)
    /// </summary>
    IQueryable<T> Where(Expression<Func<T, bool>> expression);

    /// <summary>
    /// Phân trang — OFFSET (pageNumber-1)*pageSize ROWS FETCH NEXT pageSize ROWS ONLY
    /// Luôn gọi SAU WithSorting, vì phân trang không có thứ tự sắp xếp sẽ không nhất quán.
    ///
    /// INPUT:
    ///   pageNumber (int) — Trang hiện tại, bắt đầu từ 1. Giá trị &lt; 1 → tự set về 1.
    ///   pageSize   (int) — Số bản ghi mỗi trang. Giá trị &lt; 1 → tự set về 10.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query đã có .Skip() và .Take().
    ///
    /// TẠI SAO (pageNumber, pageSize) thay vì (skip, take) ?
    ///   ✅ pageNumber/pageSize → ngôn ngữ gần với UI/Frontend hơn
    ///   ✅ Tránh caller tự tính (page-1)*size → dễ sai lệch off-by-one
    ///   ❌ skip/take → lộ implementation detail, caller phải tự tính skip
    ///
    /// VÍ DỤ:
    ///   .WithPagination(2, 20)
    ///   → .Skip(20).Take(20)   — lấy bản ghi 21-40
    /// </summary>
    IQueryable<T> WithPagination(int pageNumber, int pageSize);

    /// <summary>
    /// Terminal method — kết thúc chain và trả về IQueryable để thực thi.
    /// Query CHƯA được thực thi (deferred execution) cho đến khi gọi
    /// .ToList(), .ToListAsync(), .Count(), .FirstOrDefault(), v.v.
    ///
    /// OUTPUT:
    ///   IQueryable&lt;T&gt; — Query hoàn chỉnh sẵn sàng để EF Core translate sang SQL.
    ///
    /// TẠI SAO cần Build() nếu các method khác cũng đã trả IQueryable ?
    ///   Đánh dấu rõ điểm kết thúc của chain — giúp đọc code dễ hiểu hơn,
    ///   và cho phép implementation sau này thêm validation/logging
    ///   tập trung tại 1 điểm trước khi query được thực thi.
    ///
    /// VÍ DỤ:
    ///   var users = await builder
    ///       .WithKeyword("admin", "Name", "Email")
    ///       .WithFilter(request.Filters)
    ///       .WithSorting("CreatedAt", "desc")
    ///       .WithPagination(1, 20)
    ///       .Build()                       // ← kết thúc chain
    ///       .ToListAsync(cancellationToken); // ← thực thi SQL
    /// </summary>
    IQueryable<T> Build();
}