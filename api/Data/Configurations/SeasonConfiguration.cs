using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// SeasonConfiguration.cs
public class SeasonConfiguration : AuditableEntityConfiguration<Season>
{
    public override void Configure(EntityTypeBuilder<Season> builder)
    {
        base.Configure(builder);
        builder.ToTable("Seasons");

        builder.Property(s => s.Name).HasMaxLength(200).IsRequired(false);
        builder.Property(s => s.Description).HasMaxLength(1000).IsRequired(false);
        builder.Property(s => s.StartDate).IsRequired();
        builder.Property(s => s.EndDate).IsRequired();
        builder.Property(s => s.RegistrationDeadline).IsRequired();
        builder.Property(s => s.IsRegistrationOpen).HasDefaultValue(false);

        builder.Property(s => s.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(s => s.Tournament)
            .WithMany(t => t.Seasons)
            .HasForeignKey(s => s.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.SeasonTeams)
            .WithOne(st => st.Season)
            .HasForeignKey(st => st.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.Phases)
            .WithOne(p => p.Season)
            .HasForeignKey(p => p.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.PlayerStatistics)
            .WithOne(ps => ps.Season)
            .HasForeignKey(ps => ps.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);

        // NoAction tránh cascade conflict
        builder.HasOne<Team>()
            .WithMany()
            .HasForeignKey(s => s.ChampionTeamId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne<Player>()
            .WithMany()
            .HasForeignKey(s => s.TopScorerPlayerId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);
    }
}
