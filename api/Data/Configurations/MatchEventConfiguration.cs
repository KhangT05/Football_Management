using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class MatchEventConfiguration : IEntityTypeConfiguration<MatchEvent>
{
    public void Configure(EntityTypeBuilder<MatchEvent> builder)
    {
        builder.HasKey(me => me.Id);
        builder.Property(me => me.EventType).IsRequired().HasMaxLength(50);
        builder.Property(me => me.Details).HasMaxLength(500);
        builder.Property(me => me.CardColor).HasMaxLength(20);

        builder.HasOne(me => me.Match).WithMany(m => m.MatchEvents).HasForeignKey(me => me.MatchId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(me => me.Player).WithMany().HasForeignKey(me => me.PlayerId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(me => me.Team).WithMany().HasForeignKey(me => me.TeamId).OnDelete(DeleteBehavior.SetNull);
    }
}
