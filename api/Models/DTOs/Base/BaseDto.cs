namespace DoAnTotNghiep.API.Models.DTOs.Base;

public abstract class BaseDto
{
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}