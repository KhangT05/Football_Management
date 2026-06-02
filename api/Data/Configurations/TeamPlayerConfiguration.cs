using Football_Management.API.Common;
using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// TeamPlayerConfiguration.cs
public class TeamPlayerConfiguration : AuditableEntityConfiguration<TeamPlayer>
{
    public override void Configure(EntityTypeBuilder<TeamPlayer> builder)
    {
        base.Configure(builder);
        builder.ToTable("TeamPlayers");

        builder.Property(tp => tp.JerseyNumber).IsRequired();

        builder.Property(tp => tp.Position)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(tp => tp.Role)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(tp => tp.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(tp => tp.ApprovalStatus)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(ApprovalStatus.Pending);

        builder.HasOne(tp => tp.Team)
            .WithMany(t => t.TeamPlayers)
            .HasForeignKey(tp => tp.TeamId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(tp => tp.Player)
            .WithMany(p => p.TeamPlayers)
            .HasForeignKey(tp => tp.PlayerId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
