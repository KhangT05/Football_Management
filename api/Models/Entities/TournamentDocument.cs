using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class TournamentDocument : AuditableEntity
{
    public int TournamentId { get; set; }
    public string Title { get; set; }
    public DocumentType Type { get; set; }
    public string FileUrl { get; set; }
    public Tournament Tournament { get; set; }
}
