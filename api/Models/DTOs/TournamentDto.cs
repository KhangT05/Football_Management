using DoAnTotNghiep.API.Models.DTOs.Base;

namespace DoAnTotNghiep.API.Models.DTOs;

public class TournamentDto : BaseDto
{
    public required string Name { get; set; }
    public string Description { get; set; }
    public string Logo { get; set; }
    public int MaxTeams { get; set; }
}

public class CreateUpdateTournamentDto
{
    public required string Name { get; set; }
    public string Description { get; set; }
    public string Logo { get; set; }
    public required int MaxTeams { get; set; }
}
