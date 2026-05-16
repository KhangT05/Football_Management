using DoAnTotNghiep.API.Common;
using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.Property(r => r.Name).IsRequired().HasMaxLength(MaxLength.Name.Default);
        builder.Property(r => r.Description).HasMaxLength(500);

        builder.HasMany(r => r.UserRoles).WithOne(ur => ur.Role).HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Cascade);

        builder.HasData(
            new Role { Id = 1, Name = "Admin", Description = "Administrator", IsActive = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = 2, Name = "User", Description = "Regular User", IsActive = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = 3, Name = "Manager", Description = "Tournament Manager", IsActive = true, CreatedAt = DateTime.UtcNow }
        );
    }
}
