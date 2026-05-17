namespace DoAnTotNghiep.API.Models.Entities.Base;
/// <summary>
/// Mở rộng từ BaseEntities để bổ sung thông tin audit (theo dõi người tạo/cập nhật).
/// </summary>
public abstract class AuditableEntity : BaseEntity
{
    public int? CreatedBy { get; set; }
    public User CreatedByUser { get; set; }
    public int? UpdatedBy { get; set; }
    public User UpdatedByUser { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
    public User DeletedByUser { get; set; }
    public bool IsDeleted { get; set; } = false;
}