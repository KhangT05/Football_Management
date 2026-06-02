using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// VenueConfiguration.cs
public class VenueConfiguration : AuditableEntityConfiguration<Venue>
{
    public override void Configure(EntityTypeBuilder<Venue> builder)
    {
        base.Configure(builder);
        builder.ToTable("Venues");

        builder.Property(v => v.Name).IsRequired().HasMaxLength(200);
        builder.Property(v => v.Address).HasMaxLength(500).IsRequired(false);

        builder.HasMany(v => v.Matches)
            .WithOne(m => m.Venue)
            .HasForeignKey(m => m.VenueId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}