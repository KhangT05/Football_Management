namespace DoAnTotNghiep.API.Models.DTOs.Base;

public interface ISoftDeletableDto
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
    Guid? DeletedBy { get; set; }
}
public abstract class SoftDeletedDto : BaseDto, ISoftDeletableDto
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}