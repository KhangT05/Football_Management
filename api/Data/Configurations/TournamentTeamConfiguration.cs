// using DoAnTotNghiep.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace DoAnTotNghiep.API.Data.Configurations;

// public class TournamentTeamConfiguration : IEntityTypeConfiguration<TournamentTeam>
// {
//     public void Configure(EntityTypeBuilder<TournamentTeam> builder)
//     {
//         builder.HasKey(tt => tt.Id);
//         builder.Property(tt => tt.Status).IsRequired().HasMaxLength(50);

//         builder.HasOne(tt => tt.Season).WithMany(s => s.TournamentTeams).HasForeignKey(tt => tt.SeasonId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(tt => tt.Team).WithMany(t => t.TournamentTeams).HasForeignKey(tt => tt.TeamId).OnDelete(DeleteBehavior.Cascade);

//         builder.HasIndex(tt => new { tt.SeasonId, tt.TeamId }).IsUnique();
//     }
// }
