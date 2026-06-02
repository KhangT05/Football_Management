using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// MatchResultConfiguration.cs
public class MatchResultConfiguration : AuditableEntityConfiguration<MatchResult>
{
    public override void Configure(EntityTypeBuilder<MatchResult> builder)
    {
        base.Configure(builder);
        builder.ToTable("MatchResults");

        builder.Property(r => r.HomeScore).IsRequired();
        builder.Property(r => r.AwayScore).IsRequired();
        builder.Property(r => r.HomeHalfTimeScore).IsRequired();
        builder.Property(r => r.AwayHalfTimeScore).IsRequired();
        builder.Property(r => r.HomeFinalScore).IsRequired();
        builder.Property(r => r.AwayFinalScore).IsRequired();

        builder.Property(r => r.HomeExtraTimeScore).IsRequired(false);
        builder.Property(r => r.AwayExtraTimeScore).IsRequired(false);
        builder.Property(r => r.HomePenaltyScore).IsRequired(false);
        builder.Property(r => r.AwayPenaltyScore).IsRequired(false);
        builder.Property(r => r.Notes).HasMaxLength(500).IsRequired(false);

        builder.Property(r => r.ResultType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Ignore(r => r.WentToPenalty);
        builder.Ignore(r => r.IsAdministrative);

        // 1-1 với Match — config ở MatchConfiguration
        builder.HasOne(r => r.WinnerTeam)
            .WithMany()
            .HasForeignKey(r => r.WinnerTeamId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);
    }
}