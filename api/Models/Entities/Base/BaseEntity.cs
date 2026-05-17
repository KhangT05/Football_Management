using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.API.Models.Entities.Base;
/// <summary>
/// Base entity chứa các thuộc tính chung cho tất cả các bảng.
/// Bao gồm định danh và thông tin trạng thái, thời gian tạo/cập nhật.
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }
    public Boolean IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}