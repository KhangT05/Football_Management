// using DoAnTotNghiep.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace DoAnTotNghiep.API.Data.Configurations;

// public class TeamStandingConfiguration : IEntityTypeConfiguration<TeamStanding>
// {
//     public void Configure(EntityTypeBuilder<TeamStanding> builder)
//     {
//         builder.HasKey(ts => ts.Id);

//         builder.HasOne(ts => ts.Phase).WithMany(p => p.TeamStandings).HasForeignKey(ts => ts.PhaseId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(ts => ts.Team).WithMany().HasForeignKey(ts => ts.TeamId).OnDelete(DeleteBehavior.Cascade);

//         builder.HasIndex(ts => new { ts.PhaseId, ts.TeamId }).IsUnique();
//     }
// }
