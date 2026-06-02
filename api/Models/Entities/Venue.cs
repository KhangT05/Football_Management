using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class Venue : AuditableEntity
{
    public string Name { get; set; }
    public string? Address { get; set; }
    public ICollection<Match> Matches { get; set; }
}
