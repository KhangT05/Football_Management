using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class TeamConfiguration : AuditableEntityConfiguration<Team>
{
    public override void Configure(EntityTypeBuilder<Team> builder)
    {
        base.Configure(builder);

        builder.ToTable("Teams");

        builder.Property(t => t.Name).IsRequired().HasMaxLength(MaxLength.Default);
        builder.Property(t => t.CoachName).HasMaxLength(MaxLength.Credential);
        builder.Property(t => t.Logo).HasMaxLength(MaxLength.Summary);
        builder.Property(t => t.Description).HasMaxLength(MaxLength.MaxDesc);

        builder.HasMany(t => t.TeamPlayers).WithOne(tp => tp.Team)
            .HasForeignKey(tp => tp.TeamId).OnDelete(DeleteBehavior.Cascade);
    }
}
