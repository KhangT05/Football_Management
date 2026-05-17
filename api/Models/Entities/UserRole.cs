using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class UserRole
{
    /// <summary>
    /// Quan hệ nhiều-nhiều giữa User và Role
    /// </summary>
    public int UserId { get; set; }
    public int RoleId { get; set; }

    public User User { get; set; }
    public Role Role { get; set; }
}