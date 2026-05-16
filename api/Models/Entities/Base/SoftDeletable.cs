namespace DoAnTotNghiep.API.Models.Entities.Base;
/// <summary>
/// Định nghĩa contract cho các entity hỗ trợ soft delete.
/// Soft delete là cơ chế không xóa dữ liệu khỏi database,
/// mà chỉ đánh dấu đã bị xóa.
/// Lưu ý
/// Tất cả các fields trong interface của C# đều là public
/// </summary>
public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
    Guid? DeletedBy { get; set; }
}
public abstract class SoftDeletableEntity : BaseEntities, ISoftDeletable
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}