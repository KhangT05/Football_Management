using System.Net;

namespace DoAnTotNghiep.API.Common;

public class APIResponse<T>
{
    //get -> đọc giá trị còn init là gán giá trị khi khởi tạo object, set là gán bất cứ lúc nào
    public T? Data { get; init; }
    public bool Success { get; init; }
    public string? Message { get; init; }
    public object? Error { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
    public int StatusCode { get; init; }
    /// <summary>
    /// Dùng hashset ở đây là để không trùng,lookup O(1)
    /// nếu dùng thì sẽ nhanh hơn List.Contains
    /// </summary>
    private static readonly HashSet<HttpStatusCode> SuccessCode =
    [
        HttpStatusCode.OK, // 200,
        HttpStatusCode.Created, // 201,
        HttpStatusCode.Accepted, // 202,
        HttpStatusCode.NoContent, // 204,
    ];

    public static APIResponse<T> Ok(
        T? data = default,
        string? message = null,
        HttpStatusCode statusCode = HttpStatusCode.OK) => new()
        {
            StatusCode = (int)statusCode,
            Success = true,
            Data = data,
            Message = message,
        };
    public static APIResponse<T> Fail(
        object? error,
        string? message,
        HttpStatusCode statusCode = HttpStatusCode.InternalServerError
     ) => new()
     {
         StatusCode = (int)statusCode,
         Success = false,
         Error = error,
         Message = message,
     };
    public static APIResponse<T> Messages(
        string? message,
        HttpStatusCode statusCode = HttpStatusCode.OK) => new()
        {
            StatusCode = (int)statusCode,
            Success = SuccessCode.Contains(statusCode),
            Message = message,
        };
}