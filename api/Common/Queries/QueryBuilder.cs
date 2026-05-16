using System.Linq.Expressions;
using DoAnTotNghiep.API.Common.Enums;
using DoAnTotNghiep.API.Common.Queries.Interface;

namespace DoAnTotNghiep.API.Common.Queries;

public class QueryBuilder<T> : IQueryBuilder<T>
{
    private IQueryable<T> _query;

    public QueryBuilder(IQueryable<T> query)
    {
        _query = query;
    }

    public IQueryable<T> Build()
    {
        return _query;
    }

    public IQueryable<T> Where(Expression<Func<T, bool>> expression)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithCondition(IEnumerable<FilterCondition> conditions)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithDate(string field, DateTime? fromDate, DateTime? toDate)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithFilter(Dictionary<string, string?> filter)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithIncludes(params string[] includes)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithKeyword(string? keyword, params string[] fields)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithPagination(int pageNumber, int pageSize)
    {
        throw new NotImplementedException();
    }

    public IQueryable<T> WithSorting(string? sortBy, string? sortDirection = "asc")
    {
        throw new NotImplementedException();
    }

    // Các phương thức để thêm điều kiện, sắp xếp, phân trang, v.v. sẽ được triển khai ở đây
}