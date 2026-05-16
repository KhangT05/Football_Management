namespace DoAnTotNghiep.API.Models.Entities.Base;
/// <summary>
/// Mở rộng từ BaseEntities để bổ sung thông tin audit (theo dõi người tạo/cập nhật).
/// </summary>
public abstract class AuditableEntity : BaseEntities
{
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}