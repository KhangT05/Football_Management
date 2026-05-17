// namespace DoAnTotNghiep.API.Models.DTOs;

// public class MatchDto : AuditableDto
// {
//     public required int SeasonId { get; set; }
//     public required int PhaseId { get; set; }
//     public required int HomeTeamId { get; set; }
//     public required int AwayTeamId { get; set; }
//     public required int VenueId { get; set; }
//     public required DateTime MatchDate { get; set; }
//     public required TimeSpan StartTime { get; set; }
//     public required string Status { get; set; }
//     public string HomeTeamType { get; set; }
//     public string Referee { get; set; }
// }

// public class CreateUpdateMatchDto
// {
//     public required int SeasonId { get; set; }
//     public required int PhaseId { get; set; }
//     public required int HomeTeamId { get; set; }
//     public required int AwayTeamId { get; set; }
//     public required int VenueId { get; set; }
//     public required DateTime MatchDate { get; set; }
//     public required TimeSpan StartTime { get; set; }
//     public string Status { get; set; } = "Scheduled";
//     public string Referee { get; set; }
// }

// public class MatchDetailDto : MatchDto
// {
//     public SeasonDto Season { get; set; }
//     public PhaseDto Phase { get; set; }
//     public TeamDto HomeTeam { get; set; }
//     public TeamDto AwayTeam { get; set; }
//     public VenueDto Venue { get; set; }
//     public List<MatchEventDto> MatchEvents { get; set; } = new List<MatchEventDto>();
//     public MatchResultDto MatchResult { get; set; }
// }
