using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class PlayerConfiguration : AuditableEntityConfiguration<Player>
{
    public override void Configure(EntityTypeBuilder<Player> builder)
    {
        base.Configure(builder);

        builder.ToTable("Players");
        builder.Property(p => p.Position).HasConversion<string>().HasMaxLength(MaxLength.Medium);
        builder.Property(p => p.Nationality).IsRequired().HasMaxLength(MaxLength.ShortDesc);
        builder.Property(p => p.Height).HasColumnType("decimal(10,2)");
        builder.Property(p => p.Weight).HasColumnType("decimal(10,2)");
        builder.Property(p => p.Avatar).HasMaxLength(MaxLength.Summary);

        builder.HasMany(p => p.TeamPlayers).WithOne(tp => tp.Player)
            .HasForeignKey(tp => tp.PlayerId).OnDelete(DeleteBehavior.Cascade);
    }
}
