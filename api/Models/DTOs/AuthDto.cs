namespace DoAnTotNghiep.API.Models.DTOs;

public class AuthLoginDto
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}
public class AuthRegisterDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
}
