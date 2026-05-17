using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    public Role() { }

    public Role(string name, string? description = null)
    {
        Name = name;
        Description = description;
    }
}