using DoAnTotNghiep.API.Data.Configuration;
using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class TeamPlayerConfiguration : AuditableEntityConfiguration<TeamPlayer>
{
    public override void Configure(EntityTypeBuilder<TeamPlayer> builder)
    {
        base.Configure(builder);

        builder.ToTable("TeamPlayers");

        builder.HasKey(tp => new { tp.TeamId, tp.PlayerId });
        builder.Property(tp => tp.JerseyNumber).IsRequired();
        builder.Property(tp => tp.Position).IsRequired().HasMaxLength(50);
        builder.Property(tp => tp.Role).IsRequired().HasMaxLength(50);
        builder.Property(tp => tp.Status).IsRequired().HasMaxLength(50);

        builder.HasOne(tp => tp.Team).WithMany(t => t.TeamPlayers)
            .HasForeignKey(tp => tp.TeamId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(tp => tp.Player).WithMany(p => p.TeamPlayers)
            .HasForeignKey(tp => tp.PlayerId).OnDelete(DeleteBehavior.Cascade);
    }
}
