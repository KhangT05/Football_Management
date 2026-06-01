// using Football_Management.API.Models.Entities.Base;

// namespace Football_Management.API.Models.Entities;
// /// <summary>
// /// Đại diện cho một đội bóng tham gia giải đấu.
// /// </summary>
// public class Team : AuditableEntity
// {
//     /// <summary>
//     /// Tên đội bóng (ví dụ: Manchester United, Real Madrid,...)
//     /// </summary>
//     public string Name { get; set; }
//     /// <summary>
//     /// Tên huấn luyện viên trưởng của đội bóng.
//     /// </summary>
//     public string CoachName { get; set; }
//     public string Logo { get; set; }
//     public string Description { get; set; }

//     public ICollection<TeamPlayer> TeamPlayers { get; set; } = new List<TeamPlayer>();
//     public int LeaderUserId { get; set; }
//     public User LeaderUser { get; set; }
//     // public ICollection<SeasonTeam> SeasonTeams { get; set; } = new List<SeasonTeam>();

//     public Team() { }

//     public Team(string name, string coachName, string? logo = null, string? description = null)
//     {
//         Name = name;
//         CoachName = coachName;
//         Logo = logo;
//         Description = description;
//     }
// }
