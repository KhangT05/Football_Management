using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class Group : AuditableEntity
{
    public string Name { get; set; }
    public int PhaseId { get; set; }
    // Navigation property
    public Phase Phase { get; set; }
}