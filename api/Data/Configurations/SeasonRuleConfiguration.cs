// SeasonRuleConfiguration.cs
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class SeasonRuleConfiguration : AuditableEntityConfiguration<SeasonRule>
{
    public override void Configure(EntityTypeBuilder<SeasonRule> builder)
    {
        base.Configure(builder);
        builder.ToTable("SeasonRules");

        builder.Property(r => r.PointsPerWin).IsRequired().HasDefaultValue(3);
        builder.Property(r => r.PointsPerDraw).IsRequired().HasDefaultValue(1);
        builder.Property(r => r.PointsPerLoss).IsRequired().HasDefaultValue(0);
        builder.Property(r => r.YellowCardsForSuspension).IsRequired().HasDefaultValue(3);
        builder.Property(r => r.MaxPlayersPerTeam).IsRequired().HasDefaultValue(25);
        builder.Property(r => r.MinPlayersPerTeam).IsRequired().HasDefaultValue(11);
        builder.Property(r => r.ForfeitScore).IsRequired().HasDefaultValue(3);
        builder.Property(r => r.TeamsAdvancePerGroup).IsRequired().HasDefaultValue(2);
        builder.Property(r => r.RegistrationFee)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        // 1-1 với Season
        builder.HasOne(r => r.Season)
            .WithOne()
            .HasForeignKey<SeasonRule>(r => r.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}