using DoAnTotNghiep.API.Data;
using DoAnTotNghiep.API.Models.Entities;
using DoAnTotNghiep.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.API.Repositories.Implements;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    private readonly DbSet<User> _user;
    public UserRepository(
        AppDbContext db
    ) : base(db)
    {
        _user = db.Users;
    }

}