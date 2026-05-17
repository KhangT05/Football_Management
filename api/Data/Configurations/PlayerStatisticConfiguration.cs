// using DoAnTotNghiep.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace DoAnTotNghiep.API.Data.Configurations;

// public class PlayerStatisticConfiguration : IEntityTypeConfiguration<PlayerStatistic>
// {
//     public void Configure(EntityTypeBuilder<PlayerStatistic> builder)
//     {
//         builder.HasKey(ps => ps.Id);
//         builder.Property(ps => ps.PassAccuracy).HasPrecision(5, 2);

//         builder.HasOne(ps => ps.Player).WithMany(p => p.PlayerStatistics).HasForeignKey(ps => ps.PlayerId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(ps => ps.Team).WithMany(t => t.PlayerStatistics).HasForeignKey(ps => ps.TeamId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(ps => ps.Season).WithMany(s => s.PlayerStatistics).HasForeignKey(ps => ps.SeasonId).OnDelete(DeleteBehavior.Cascade);

//         builder.HasIndex(ps => new { ps.PlayerId, ps.TeamId, ps.SeasonId }).IsUnique();
//     }
// }
