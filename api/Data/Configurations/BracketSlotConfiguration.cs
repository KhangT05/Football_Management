using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// BracketSlotConfiguration.cs
public class BracketSlotConfiguration : AuditableEntityConfiguration<BracketSlot>
{
    public override void Configure(EntityTypeBuilder<BracketSlot> builder)
    {
        base.Configure(builder);
        builder.ToTable("BracketSlots");

        builder.Property(b => b.SlotNumber).IsRequired();
        builder.Property(b => b.SlotName).IsRequired().HasMaxLength(50);

        builder.Property(b => b.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(b => b.Phase)
            .WithMany(p => p.BracketSlots)
            .HasForeignKey(b => b.PhaseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Team)
            .WithMany()
            .HasForeignKey(b => b.TeamId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        // Self-referencing SourceSlot — NoAction
        // builder.HasOne(b => b.SourceSlot)
        //     .WithMany()
        //     .HasForeignKey(b => b.SourceSlotId)
        //     .OnDelete(DeleteBehavior.NoAction)
        //     .IsRequired(false);

        // Self-referencing NextSlot — NoAction
        builder.HasOne(b => b.NextSlot)
            .WithMany()
            .HasForeignKey(b => b.NextSlotId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne(b => b.Match)
            .WithMany()
            .HasForeignKey(b => b.MatchId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        // SlotNumber unique trong cùng phase
    }
}