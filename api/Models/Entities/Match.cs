using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class Match : AuditableEntity
{
    public int SeasonId { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public DateTime MatchDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public MatchStatus Status { get; set; }
    public string Referee { get; set; }
    public Season Season { get; set; }
    public Team HomeTeam { get; set; }
    public Team AwayTeam { get; set; }
    public ICollection<MatchEvent> MatchEvents { get; set; } = new List<MatchEvent>();
    public MatchResult MatchResult { get; set; }
    public int PhaseId { get; set; }
    public Phase Phase { get; set; }
    public int? GroupId { get; set; }
    public Group Group { get; set; }
    public int? VenueId { get; set; }
    public Venue Venue { get; set; }
    public int? Round { get; set; }
    public bool IsPublished { get; set; } = false;

    public Match() { }

    public Match(int seasonId, int homeTeamId,
     int awayTeamId, DateTime matchDate, TimeSpan startTime,
      MatchStatus status = MatchStatus.Scheduled, string? referee = null)
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

