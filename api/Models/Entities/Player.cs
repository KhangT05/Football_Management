using DoAnTotNghiep.API.Common.Enums;
using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class Player : AuditableEntity
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public DateTime DateOfBirth { get; set; }
    public PlayerPosition Position { get; set; } // Goalkeeper, Defender, Midfielder, Forward
    public decimal? Height { get; set; } //cm
    public decimal? Weight { get; set; }//kg
    public string Nationality { get; set; }
    public string Avatar { get; set; }
    public ICollection<TeamPlayer> TeamPlayers { get; set; } = new List<TeamPlayer>();

    public Player() { }

    public Player(string name, DateTime dateOfBirth,
    PlayerPosition position, string nationality, string? email = null,
     string? phone = null, decimal? height = null, decimal? weight = null, string? avatar = null)
    {
        Name = name;
        DateOfBirth = dateOfBirth;
        Position = position;
        Nationality = nationality;
        Email = email;
        Phone = phone;
        Height = height;
        Weight = weight;
        Avatar = avatar;
    }
}
