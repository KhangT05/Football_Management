using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class UserRole : BaseEntities
{
    /// <summary>
    /// Quan hệ nhiều-nhiều giữa User và Role
    /// </summary>
    public int UserId { get; set; }
    public int RoleId { get; set; }

    public User User { get; set; }
    public Role Role { get; set; }

    public UserRole() { }

    public UserRole(int userId, int roleId)
    {
        UserId = userId;
        RoleId = roleId;
    }
}