using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// TeamStandingConfiguration.cs
public class TeamStandingConfiguration : AuditableEntityConfiguration<TeamStanding>
{
    public override void Configure(EntityTypeBuilder<TeamStanding> builder)
    {
        base.Configure(builder);
        builder.ToTable("TeamStandings");

        builder.Property(ts => ts.Position).IsRequired();
        builder.Property(ts => ts.MatchesPlayed).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.Wins).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.Draws).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.Losses).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.GoalsFor).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.GoalsAgainst).IsRequired().HasDefaultValue(0);
        builder.Property(ts => ts.Points).IsRequired().HasDefaultValue(0);

        builder.HasOne(ts => ts.Team)
            .WithMany()
            .HasForeignKey(ts => ts.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ts => ts.Group)
            .WithMany(g => g.TeamStandings)
            .HasForeignKey(ts => ts.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
