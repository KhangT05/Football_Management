using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;
/// <summary>
/// Đại diện cho mùa giải (Season) trong hệ thống quản lý giải đấu thể thao điện tử.
/// - Thuộc tính:
///  - TournamentId: Khóa ngoại liên kết đến giải đấu (Tournament) mà mùa giải thuộc về (bắt buộc)
///  - StartDate: Ngày bắt đầu mùa giải (bắt buộc)
///  - EndDate: Ngày kết thúc mùa giải (bắt buộc)
///  - Name: Tên mùa giải (tùy chọn, có thể là "Spring 2024", "Fall 2024",...)
/// - Quan hệ:
///  - Tournament: Liên kết đến giải đấu (Tournament) mà mùa giải thuộc về (nhiều-nhiều thông qua Season)
///  - SeasonTeams: Danh sách các đội tuyển (Team)
///  tham gia mùa giải này (mối quan hệ n-n thông qua SeasonTeams)
///  - PlayerStatistics: Danh sách thống kê của các cầu thủ (Player) 
/// trong mùa giải này (mối quan hệ n-n thông qua PlayerStatistic)
/// </summary>
public class Season : AuditableEntity
{
    public string Name { get; set; }
    public int TournamentId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public SeasonStatus Status { get; set; }
    public string Description { get; set; }
    public Tournament Tournament { get; set; }
    public ICollection<SeasonTeam> SeasonTeams { get; set; }
    public ICollection<PlayerStatistic> PlayerStatistics { get; set; }
    public DateTime RegistrationDeadline { get; set; }  // THÊM
    public bool IsRegistrationOpen { get; set; } = false; // THÊM
    public int? ChampionTeamId { get; set; }             // THÊM
    public int? TopScorerPlayerId { get; set; }          // THÊM
    public ICollection<Phase> Phases { get; set; }       // THÊM nav

    public Season() { }

    public Season(int tournamentId,
        DateTime startDate, DateTime endDate, string? name = null,
        SeasonStatus status = SeasonStatus.Upcoming, string? description = null)
    {
        TournamentId = tournamentId;
        StartDate = startDate;
        EndDate = endDate;
        Name = name;
        Status = status;
        Description = description;
    }
}

