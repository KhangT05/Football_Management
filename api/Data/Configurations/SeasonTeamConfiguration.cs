using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

// SeasonTeamConfiguration.cs
public class SeasonTeamConfiguration : AuditableEntityConfiguration<SeasonTeam>
{
    public override void Configure(EntityTypeBuilder<SeasonTeam> builder)
    {
        base.Configure(builder);
        builder.ToTable("SeasonTeams");

        builder.Property(st => st.RegisteredDate).IsRequired();

        builder.Property(st => st.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(st => st.Season)
            .WithMany(s => s.SeasonTeams)
            .HasForeignKey(st => st.SeasonId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(st => st.Team)
            .WithMany(t => t.SeasonTeams)
            .HasForeignKey(st => st.TeamId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(st => st.Group)
            .WithMany(g => g.SeasonTeams)
            .HasForeignKey(st => st.GroupId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
    }
}