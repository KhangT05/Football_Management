namespace DoAnTotNghiep.API.Common.Queries;

public static class QueryBuilderExtensions
{
    /// <summary>
    /// Tạo QueryBuilder từ bất kỳ IQueryable nào.
    /// Extension method để chuyển đổi chuỗi operator thành enum FilterOperator.
    /// Ví dụ: "eq" -> FilterOperator.Eq, "gt" -> FilterOperator.Gt, v.v.
    /// </summary> <param name="operatorStr">Chuỗi operator từ client (ví dụ: "eq", "gt", "like", v.v.)</param>
    /// <returns>FilterOperator tương ứng</returns>
    public static QueryBuilder<T> AsQueryBuilder<T>(this IQueryable<T> source)
        where T : class => new(source);

}