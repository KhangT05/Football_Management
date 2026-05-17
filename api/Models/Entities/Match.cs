using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class Match : AuditableEntity
{
    public int SeasonId { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public DateTime MatchDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public string Status { get; set; } // Scheduled, Ongoing, Completed, Postponed, Cancelled
    public string HomeTeamType { get; set; } // Home, Away
    public string Referee { get; set; }

    public Season Season { get; set; }
    public Team HomeTeam { get; set; }
    public Team AwayTeam { get; set; }
    public ICollection<MatchEvent> MatchEvents { get; set; } = new List<MatchEvent>();
    public MatchResult MatchResult { get; set; }

    public Match() { }

    public Match(int seasonId, int homeTeamId,
     int awayTeamId, DateTime matchDate, TimeSpan startTime,
      string? status = null, string? referee = null)
    {
        SeasonId = seasonId;
        HomeTeamId = homeTeamId;
        AwayTeamId = awayTeamId;
        MatchDate = matchDate;
        StartTime = startTime;
        Status = status;
        Referee = referee;
    }
}

