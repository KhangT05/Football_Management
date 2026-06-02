using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class TournamentConfiguration : BaseEntityConfiguration<Tournament>
{
    public void Configure(EntityTypeBuilder<Tournament> builder)
    {
        builder.ToTable("Tournaments");

        builder.Property(t => t.Name).IsRequired().HasMaxLength(MaxLength.Default);
        builder.Property(t => t.Description).HasMaxLength(MaxLength.MaxDesc);
        builder.Property(t => t.Logo).HasMaxLength(MaxLength.Description);

        builder.HasMany(t => t.Seasons).WithOne(s => s.Tournament)
            .HasForeignKey(s => s.TournamentId).OnDelete(DeleteBehavior.Cascade);
    }
}
