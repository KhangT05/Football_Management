
namespace DoAnTotNghiep.API.Common.Enums;

public enum FilterOperator
{
    Eq,
    Neq,
    Gt,
    Lt,
    Gte,
    Lte,
    In,
    Between,
    Like,
    NotLike
}
public class FilterCondition
{
    public string Field { get; init; } = default!;
    public FilterOperator Operator { get; init; }
    public object? Value { get; init; }
    public object? ValueTo { get; init; }
}
