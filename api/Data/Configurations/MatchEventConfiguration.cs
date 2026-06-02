using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// MatchEventConfiguration.cs
public class MatchEventConfiguration : AuditableEntityConfiguration<MatchEvent>
{
    public override void Configure(EntityTypeBuilder<MatchEvent> builder)
    {
        base.Configure(builder);
        builder.ToTable("MatchEvents");

        builder.Property(e => e.EventType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(e => e.Period)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(e => e.CardColor)
            .HasConversion<string>()
            .HasMaxLength(10)
            .IsRequired(false);

        builder.Property(e => e.Minute).IsRequired();
        builder.Property(e => e.AddedMinute).IsRequired(false);

        builder.HasOne(e => e.Match)
            .WithMany(m => m.MatchEvents)
            .HasForeignKey(e => e.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        // 3 FK đến Player — đều NoAction
        builder.HasOne(e => e.Player)
            .WithMany()
            .HasForeignKey(e => e.PlayerId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne(e => e.SubOutPlayer)
            .WithMany()
            .HasForeignKey(e => e.SubOutPlayerId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne(e => e.Team)
            .WithMany()
            .HasForeignKey(e => e.TeamId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);
    }
}
