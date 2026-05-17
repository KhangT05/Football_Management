using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;
/// <summary>
/// Đại diện cho bảng xếp hạng của một đội bóng trong một giai đoạn cụ thể của giải đấu.
/// - Thuộc tính:
/// - TeamId: Id của đội bóng (Team) mà bảng xếp hạng này đại diện (bắt buộc)
/// - Position: Vị trí của đội bóng trong bảng xếp hạng (bắt buộc)
/// - MatchesPlayed: Số trận đã chơi (bắt buộc)
/// - Wins: Số trận thắng (bắt buộc)
/// - Draws: Số trận hòa (bắt buộc)
/// - Losses: Số trận thua (bắt buộc)
/// - GoalsFor: Số bàn thắng đã ghi (bắt buộc)
/// - GoalsAgainst: Số bàn thua (bắt buộc)
/// - Points: Số điểm hiện tại của đội bóng (bắt buộc)
/// - Team: Tham chiếu đến đối tượng Team (bắt buộc)
/// </summary>
public class TeamStanding : BaseEntity
{
    public int TeamId { get; set; }
    public int Position { get; set; }
    public int MatchesPlayed { get; set; }
    public int Wins { get; set; }
    public int Draws { get; set; }
    public int Losses { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }
    public int Points { get; set; }
    public Team Team { get; set; }

    public TeamStanding() { }

    public TeamStanding(int position, int teamId, int matchesPlayed = 0, int wins = 0, int draws = 0,
    int losses = 0, int goalsFor = 0, int goalsAgainst = 0, int points = 0
    )
    {
        Position = position;
        TeamId = teamId;
        MatchesPlayed = matchesPlayed;
        Wins = wins;
        Draws = draws;
        Losses = losses;
        GoalsFor = goalsFor;
        GoalsAgainst = goalsAgainst;
        Points = points;
    }
}
