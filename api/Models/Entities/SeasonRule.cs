using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class SeasonRule : AuditableEntity
{
    public int SeasonId { get; set; }
    public int PointsPerWin { get; set; } = 3;
    public int PointsPerDraw { get; set; } = 1;
    public int PointsPerLoss { get; set; } = 0;
    public int YellowCardsForSuspension { get; set; } = 3;
    public int MaxPlayersPerTeam { get; set; } = 25;
    public int MinPlayersPerTeam { get; set; } = 11;
    public decimal RegistrationFee { get; set; }
    public int ForfeitScore { get; set; } = 3;
    public int TeamsAdvancePerGroup { get; set; } = 2;
    public Season Season { get; set; }
}