using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

public class Payment : AuditableEntity
{
    public int SeasonTeamId { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionRef { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public int? ConfirmedBy { get; set; }
    public SeasonTeam SeasonTeam { get; set; }
}