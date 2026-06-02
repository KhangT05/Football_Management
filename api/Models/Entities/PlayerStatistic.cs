using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class PlayerStatistic : BaseEntity
{
    public int PlayerId { get; set; }
    public int TeamId { get; set; }
    public int SeasonId { get; set; }
    public int MatchesPlayed { get; set; }
    public int GoalsScored { get; set; }
    public int Assists { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
    public int MinutesPlayed { get; set; }
    public int AccumulatedYellowCards { get; set; } = 0;
    public bool IsSuspended { get; set; } = false;

    public Player Player { get; set; }
    public Team Team { get; set; }
    public Season Season { get; set; }

    public PlayerStatistic() { }

    public PlayerStatistic(int playerId, int teamId, int seasonId)
    {
        PlayerId = playerId;
        TeamId = teamId;
        SeasonId = seasonId;
    }
}

