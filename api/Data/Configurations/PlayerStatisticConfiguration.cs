using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// PlayerStatisticConfiguration.cs
public class PlayerStatisticConfiguration : BaseEntityConfiguration<PlayerStatistic>
{
    public override void Configure(EntityTypeBuilder<PlayerStatistic> builder)
    {
        base.Configure(builder);
        builder.ToTable("PlayerStatistics");

        builder.Property(ps => ps.MatchesPlayed).HasDefaultValue(0);
        builder.Property(ps => ps.GoalsScored).HasDefaultValue(0);
        builder.Property(ps => ps.Assists).HasDefaultValue(0);
        builder.Property(ps => ps.YellowCards).HasDefaultValue(0);
        builder.Property(ps => ps.RedCards).HasDefaultValue(0);
        builder.Property(ps => ps.MinutesPlayed).HasDefaultValue(0);
        builder.Property(ps => ps.AccumulatedYellowCards).HasDefaultValue(0);
        builder.Property(ps => ps.IsSuspended).HasDefaultValue(false);

        builder.HasOne(ps => ps.Player)
            .WithMany()
            .HasForeignKey(ps => ps.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ps => ps.Team)
            .WithMany()
            .HasForeignKey(ps => ps.TeamId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(ps => ps.Season)
            .WithMany(s => s.PlayerStatistics)
            .HasForeignKey(ps => ps.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);

        // 1 cầu thủ 1 record per season per team
        builder.HasIndex(ps => new { ps.PlayerId, ps.SeasonId, ps.TeamId }).IsUnique();
    }
}
