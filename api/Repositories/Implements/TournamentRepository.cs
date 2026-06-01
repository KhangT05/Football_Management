using Football_Management.API.Attributes;
using Football_Management.API.Data;
using Football_Management.API.Models.Entities;
using Football_Management.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Football_Management.API.Repositories.Implements;

[Scoped]
public class TournamentRepository : BaseRepository<Tournament>, ITournamentRepository
{
    private readonly DbSet<Tournament> _tournament;
    public TournamentRepository(
        AppDbContext db
    ) : base(db)
    {
        _tournament = db.Tournaments;
    }

}