using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.API.Data.Seeders;

public static class UserSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync()) return;
        var users = new List<User>
        {
            new("Admin System",
                BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                "admin@football.com",
                "0901234567"),

            new("Ban Tổ Chức",
                BCrypt.Net.BCrypt.HashPassword("Btc@123"),
                "btc@football.com",
                "0901234568"),

            new("Trọng Tài 1",
                BCrypt.Net.BCrypt.HashPassword("Referee@123"),
                "referee1@football.com",
                "0901234569"),
        };
        await db.Users.AddRangeAsync(users);
        await db.SaveChangesAsync();
    }
}