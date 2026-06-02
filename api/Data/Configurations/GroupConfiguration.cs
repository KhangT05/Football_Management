using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// GroupConfiguration.cs
public class GroupConfiguration : AuditableEntityConfiguration<Group>
{
    public override void Configure(EntityTypeBuilder<Group> builder)
    {
        base.Configure(builder);
        builder.ToTable("Groups");

        builder.Property(g => g.Name).IsRequired().HasMaxLength(50);

        builder.HasOne(g => g.Phase)
            .WithMany(p => p.Groups)
            .HasForeignKey(g => g.PhaseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.SeasonTeams)
            .WithOne(st => st.Group)
            .HasForeignKey(st => st.GroupId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(g => g.TeamStandings)
            .WithOne(ts => ts.Group)
            .HasForeignKey(ts => ts.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}