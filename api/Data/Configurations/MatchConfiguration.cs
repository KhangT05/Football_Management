
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.IdentityModel.Tokens;

namespace Football_Management.API.Data.Configurations;

// MatchConfiguration.cs
public class MatchConfiguration : AuditableEntityConfiguration<Match>
{
    public override void Configure(EntityTypeBuilder<Match> builder)
    {
        base.Configure(builder);
        builder.ToTable("Matches");

        builder.Property(m => m.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(m => m.Referee)
            .HasMaxLength(100)
            .IsRequired(false);

        builder.Property(m => m.Round).IsRequired(false);
        builder.Property(m => m.IsPublished).HasDefaultValue(false);
        builder.Property(m => m.MatchDate).IsRequired();
        builder.Property(m => m.StartTime).IsRequired();

        builder.HasOne(m => m.Season)
            .WithMany()
            .HasForeignKey(m => m.SeasonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Phase)
            .WithMany()
            .HasForeignKey(m => m.PhaseId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(m => m.Group)
            .WithMany()
            .HasForeignKey(m => m.GroupId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne(m => m.Venue)
            .WithMany(v => v.Matches)
            .HasForeignKey(m => m.VenueId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // 2 FK đến Team — NoAction tránh multiple cascade paths
        builder.HasOne(m => m.HomeTeam)
            .WithMany()
            .HasForeignKey(m => m.HomeTeamId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(m => m.AwayTeam)
            .WithMany()
            .HasForeignKey(m => m.AwayTeamId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasMany(m => m.MatchEvents)
            .WithOne(me => me.Match)
            .HasForeignKey(me => me.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.MatchResult)
            .WithOne(mr => mr.Match)
            .HasForeignKey<MatchResult>(mr => mr.MatchId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
