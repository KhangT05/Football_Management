using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class MatchResult : AuditableEntity
{
    public int MatchId { get; set; }
    public int? WinnerTeamId { get; set; }
    public int HomeScore { get; set; }
    public int AwayScore { get; set; }
    public int? HomePenaltyScore { get; set; }
    public int? AwayPenaltyScore { get; set; }
    public string? Notes { get; set; }
    public int? Duration { get; set; } // in minutes

    public Match Match { get; set; }
    public Team WinnerTeam { get; set; }
    public int? HomeExtraTimeScore { get; set; }
    public int? AwayExtraTimeScore { get; set; }
    public int HomeFinalScore { get; set; }
    public int AwayFinalScore { get; set; }
    public MatchResultType ResultType { get; set; }
    public int HomeHalfTimeScore { get; set; }
    public int AwayHalfTimeScore { get; set; }
    public MatchResultStatus Status { get; set; }
    public bool WentToPenalty => HomePenaltyScore.HasValue;
    public bool IsAdministrative =>
        ResultType is MatchResultType.Forfeit or MatchResultType.Walkover;

    public MatchResult() { }

    public MatchResult(int matchId, int homeScore, int awayScore, int? winnerTeamId = null,
        int? duration = null, int? homePenaltyScore = null,
        int? awayPenaltyScore = null, string? notes = null)
    {
        MatchId = matchId;
        HomeScore = homeScore;
        AwayScore = awayScore;
        WinnerTeamId = winnerTeamId;
        Duration = duration;
        HomePenaltyScore = homePenaltyScore;
        AwayPenaltyScore = awayPenaltyScore;
        Notes = notes;
    }
}

