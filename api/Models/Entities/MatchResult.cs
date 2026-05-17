using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class MatchResult : AuditableEntity
{
    public int MatchId { get; set; }
    public int? WinnerTeamId { get; set; }
    public int HomeScore { get; set; }
    public int AwayScore { get; set; }
    public int? HomePenaltyScore { get; set; }
    public int? AwayPenaltyScore { get; set; }
    public int Attendance { get; set; }
    public string? Notes { get; set; }
    public int? Duration { get; set; } // in minutes

    public Match Match { get; set; }
    public Team WinnerTeam { get; set; }

    public MatchResult() { }

    public MatchResult(int matchId, int homeScore, int awayScore, int? winnerTeamId = null,
     int attendance = 0, int? duration = null, int? homePenaltyScore = null,
      int? awayPenaltyScore = null, string? notes = null)
    {
        MatchId = matchId;
        HomeScore = homeScore;
        AwayScore = awayScore;
        WinnerTeamId = winnerTeamId;
        Attendance = attendance;
        Duration = duration;
        HomePenaltyScore = homePenaltyScore;
        AwayPenaltyScore = awayPenaltyScore;
        Notes = notes;
    }
}

