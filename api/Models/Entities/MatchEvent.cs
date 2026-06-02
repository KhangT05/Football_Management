using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class MatchEvent : AuditableEntity
{
    public int MatchId { get; set; }
    public MatchEventType EventType { get; set; }
    public int Minute { get; set; }
    public int? AddedMinute { get; set; }
    public int? PlayerId { get; set; }
    public int? TeamId { get; set; }
    public CardColor? CardColor { get; set; }

    public Match Match { get; set; }
    public Player Player { get; set; }
    public Team Team { get; set; }
    public MatchPeriod Period { get; set; }
    public int? SubOutPlayerId { get; set; }
    public Player SubOutPlayer { get; set; }

    public MatchEvent() { }

    public MatchEvent(int matchId, MatchEventType eventType, int minute, int? playerId = null,
     int? teamId = null, CardColor? cardColor = null)
    {
        MatchId = matchId;
        EventType = eventType;
        Minute = minute;
        PlayerId = playerId;
        TeamId = teamId;
        CardColor = cardColor;
    }
}
