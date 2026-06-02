using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// TournamentDocumentConfiguration.cs
public class TournamentDocumentConfiguration : AuditableEntityConfiguration<TournamentDocument>
{
    public override void Configure(EntityTypeBuilder<TournamentDocument> builder)
    {
        base.Configure(builder);
        builder.ToTable("TournamentDocuments");

        builder.Property(d => d.Title).IsRequired().HasMaxLength(200);
        builder.Property(d => d.FileUrl).IsRequired().HasMaxLength(500);

        builder.Property(d => d.Type)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(d => d.Tournament)
            .WithMany()
            .HasForeignKey(d => d.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(d => new { d.TournamentId, d.Type });
    }
}