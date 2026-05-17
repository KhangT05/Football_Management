using DoAnTotNghiep.API.Common;
using DoAnTotNghiep.API.Data.Configuration;
using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class PlayerConfiguration : AuditableEntityConfiguration<Player>
{
    public override void Configure(EntityTypeBuilder<Player> builder)
    {
        base.Configure(builder);

        builder.ToTable("Players");

        builder.Property(p => p.Name).IsRequired().HasMaxLength(MaxLength.Credential);
        builder.Property(p => p.Email).HasMaxLength(MaxLength.Credential);
        builder.Property(p => p.Phone).HasMaxLength(MaxLength.Phone);
        builder.Property(p => p.Position).HasConversion<string>().HasMaxLength(MaxLength.Medium);
        builder.Property(p => p.Nationality).IsRequired().HasMaxLength(MaxLength.ShortDesc);
        builder.Property(p => p.Height).HasColumnType("decimal(10,2)");
        builder.Property(p => p.Weight).HasColumnType("decimal(10,2)");
        builder.Property(p => p.Avatar).HasMaxLength(MaxLength.Summary);

        builder.HasMany(p => p.TeamPlayers).WithOne(tp => tp.Player)
            .HasForeignKey(tp => tp.PlayerId).OnDelete(DeleteBehavior.Cascade);
    }
}
