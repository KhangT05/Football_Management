// using Football_Management.API.Common.Enums;
// using Football_Management.API.Models.Entities.Base;

// namespace Football_Management.API.Models.Entities;

// public class Player : AuditableEntity
// {
//     public DateTime DateOfBirth { get; set; }
//     public PlayerPosition Position { get; set; } // Goalkeeper, Defender, Midfielder, Forward
//     public decimal? Height { get; set; } //cm
//     public decimal? Weight { get; set; }//kg
//     public string Nationality { get; set; }
//     public string Avatar { get; set; }
//     public int UserId { get; set; }
//     public User User { get; set; }
//     public ICollection<TeamPlayer> TeamPlayers { get; set; } = new List<TeamPlayer>();

//     public Player() { }

//     public Player(DateTime dateOfBirth,
//     PlayerPosition position, string nationality, decimal? height = null, decimal? weight = null, string? avatar = null)
//     {
//         DateOfBirth = dateOfBirth;
//         Position = position;
//         Nationality = nationality;
//         Height = height;
//         Weight = weight;
//         Avatar = avatar;
//     }
// }
