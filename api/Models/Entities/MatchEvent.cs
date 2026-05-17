using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class MatchEvent : AuditableEntity
{
    public int MatchId { get; set; }
    public string EventType { get; set; } // GOAL, CARD (yellow/red), SUBSTITUTION, FULL_TIME
    public int Minute { get; set; }
    public int? SecondMinute { get; set; }
    public int? PlayerId { get; set; }
    public int? TeamId { get; set; }
    public string Details { get; set; } // e.g., "Yellow Card", "Goal", "Substitution: In: PlayerA, Out: PlayerB"
    public string CardColor { get; set; } // YELLOW, RED (if EventType is CARD)

    public Match Match { get; set; }
    public Player Player { get; set; }
    public Team Team { get; set; }

    public MatchEvent() { }

    public MatchEvent(int matchId, string eventType, int minute, int? playerId = null,
     int? teamId = null, string? details = null, string? cardColor = null)
    {
        MatchId = matchId;
        EventType = eventType;
        Minute = minute;
        PlayerId = playerId;
        TeamId = teamId;
        Details = details;
        CardColor = cardColor;
    }
}
