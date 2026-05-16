namespace DoAnTotNghiep.API.Models.DTOs.Base;

public abstract class AuditableDto : BaseDto
{
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}