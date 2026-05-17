using DoAnTotNghiep.API.Common;
using DoAnTotNghiep.API.Data.Configuration;
using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class RoleConfiguration : BaseEntityConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.Property(r => r.Name).IsRequired().HasMaxLength(MaxLength.Default);
        builder.Property(r => r.Description).HasMaxLength(500);

        builder.HasMany(r => r.UserRoles).WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Cascade);
    }
}
