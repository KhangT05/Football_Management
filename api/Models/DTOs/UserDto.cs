using DoAnTotNghiep.API.Models.DTOs.Base;

namespace DoAnTotNghiep.API.Models.DTOs;

public class UserDto : AuditableDto
{
    public required string Email { get; set; }
    public required string Name { get; set; }
    public string? Phone { get; set; }
}

public class CreateUpdateUserDto : AuditableDto
{
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string Password { get; set; }
    public string? Phone { get; set; }
}