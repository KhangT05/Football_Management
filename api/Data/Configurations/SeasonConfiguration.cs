// using DoAnTotNghiep.API.Common;
// using DoAnTotNghiep.API.Data.Configuration;
// using DoAnTotNghiep.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace DoAnTotNghiep.API.Data.Configurations;

// public class SeasonConfiguration : AuditableEntityConfiguration<Season>
// {
//     public void Configure(EntityTypeBuilder<Season> builder)
//     {
//         builder.ToTable("Seasons");

//         builder.Property(s => s.Name).HasMaxLength(MaxLength.Default);
//         builder.Property(s => s.Description).HasMaxLength(MaxLength.Description);

//         builder.HasOne(s => s.Tournament).WithMany(t => t.Seasons)
//         .HasForeignKey(s => s.TournamentId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasMany(s => s.SeasonTeams).WithOne(tt => tt.Season)
//             .HasForeignKey(tt => tt.SeasonId).OnDelete(DeleteBehavior.Cascade);

//     }
// }
