using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class Group : AuditableEntity
{
    public string Name { get; set; }
    public int PhaseId { get; set; }
    // Navigation property
    public Phase Phase { get; set; }
    public ICollection<SeasonTeam> SeasonTeams { get; set; }     // THÊM nav
    public ICollection<TeamStanding> TeamStandings { get; set; } // THÊM nav
}