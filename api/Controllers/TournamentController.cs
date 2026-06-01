using Football_Management.API.Controllers.Base;
using Football_Management.API.Models.DTOs;
using Football_Management.API.Models.Entities;
using Football_Management.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Football_Management.API.Controllers;

[Route("api/v1/tournament")]
[AllowAnonymous]
public class TournamentController
    : BaseController<Tournament, TournamentDto, CreateUpdateTournamentDto, CreateUpdateTournamentDto>
{
    private readonly ITournamentService _tournamentService;
    public TournamentController(
        ITournamentService tournamentService,
        ILogger<TournamentController> logger
    ) : base(tournamentService, logger)
    {
        _tournamentService = tournamentService;
    }
}