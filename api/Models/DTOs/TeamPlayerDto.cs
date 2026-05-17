using DoAnTotNghiep.API.Models.DTOs.Base;

namespace DoAnTotNghiep.API.Models.DTOs;

public class TeamPlayerDto : BaseDto
{
    public required int TeamId { get; set; }
    public required int PlayerId { get; set; }
    public required DateTime JoinDate { get; set; }
    public DateTime? LeaveDate { get; set; }
    public required int JerseyNumber { get; set; }
    public required string Position { get; set; }
    public required string Role { get; set; }
    public required string Status { get; set; }
    public TeamDto Team { get; set; }
    public PlayerDto Player { get; set; }
}

public class CreateUpdateTeamPlayerDto
{
    public required int TeamId { get; set; }
    public required int PlayerId { get; set; }
    public required DateTime JoinDate { get; set; }
    public DateTime? LeaveDate { get; set; }
    public required int JerseyNumber { get; set; }
    public required string Position { get; set; }
    public string Role { get; set; } = "Player";
    public string Status { get; set; } = "Active";
}
