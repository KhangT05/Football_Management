// using DoAnTotNghiep.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace DoAnTotNghiep.API.Data.Configurations;

// public class MatchConfiguration : IEntityTypeConfiguration<Match>
// {
//     public void Configure(EntityTypeBuilder<Match> builder)
//     {
//         builder.HasKey(m => m.Id);
//         builder.Property(m => m.Status).IsRequired().HasMaxLength(50);
//         builder.Property(m => m.HomeTeamType).HasMaxLength(20);
//         builder.Property(m => m.Referee).HasMaxLength(255);

//         builder.HasOne(m => m.Season).WithMany().HasForeignKey(m => m.SeasonId).OnDelete(DeleteBehavior.Restrict);
//         builder.HasOne(m => m.Phase).WithMany(p => p.Matches).HasForeignKey(m => m.PhaseId).OnDelete(DeleteBehavior.Restrict);
//         builder.HasOne(m => m.HomeTeam).WithMany(t => t.HomeMatches).HasForeignKey(m => m.HomeTeamId).OnDelete(DeleteBehavior.Restrict);
//         builder.HasOne(m => m.AwayTeam).WithMany(t => t.AwayMatches).HasForeignKey(m => m.AwayTeamId).OnDelete(DeleteBehavior.Restrict);
//         builder.HasOne(m => m.Venue).WithMany(v => v.Matches).HasForeignKey(m => m.VenueId).OnDelete(DeleteBehavior.Restrict);
//         builder.HasMany(m => m.MatchEvents).WithOne(me => me.Match).HasForeignKey(me => me.MatchId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(m => m.MatchResult).WithOne(mr => mr.Match).HasForeignKey<MatchResult>(mr => mr.MatchId).OnDelete(DeleteBehavior.Cascade);
//     }
// }
