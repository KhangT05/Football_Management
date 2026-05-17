using DoAnTotNghiep.API.Models.DTOs.Base;

namespace DoAnTotNghiep.API.Models.DTOs;

public class PlayerDto : BaseDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Position { get; set; }
    public string Height { get; set; }
    public string Weight { get; set; }
    public string Nationality { get; set; }
    public string Avatar { get; set; }
}

public class CreateUpdatePlayerDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string P { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Position { get; set; }
    public string Height { get; set; }
    public string Weight { get; set; }
    public string Nationality { get; set; }
    public string Avatar { get; set; }
}
