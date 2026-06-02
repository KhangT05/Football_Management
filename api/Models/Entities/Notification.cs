using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class Notification : AuditableEntity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public NotificationType Type { get; set; }
    public NotificationSource Source { get; set; }
    public int? SeasonId { get; set; }
    public int? TargetTeamId { get; set; }
    public int? RecipientUserId { get; set; }
    public bool IsRead { get; set; } = false;
    public string? RefEntityType { get; set; }
    public int? RefEntityId { get; set; }
    public Season Season { get; set; }
    public Team TargetTeam { get; set; }
}