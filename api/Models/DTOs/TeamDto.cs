using DoAnTotNghiep.API.Models.DTOs.Base;

namespace DoAnTotNghiep.API.Models.DTOs;

public class TeamDto : BaseDto
{
    public string Name { get; set; }
    public string CoachName { get; set; }
    public string Logo { get; set; }
    public string Description { get; set; }
}

public class CreateUpdateTeamDto
{
    public string Name { get; set; }
    public string CoachName { get; set; }
    public string Logo { get; set; }
    public string Description { get; set; }
}

public class TeamDetailDto : TeamDto
{
    public List<TeamPlayerDto> TeamPlayers { get; set; } = new List<TeamPlayerDto>();
}
