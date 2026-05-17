using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configurations;

public class MatchResultConfiguration : IEntityTypeConfiguration<MatchResult>
{
    public void Configure(EntityTypeBuilder<MatchResult> builder)
    {
        builder.HasKey(mr => mr.Id);

        builder.HasOne(mr => mr.Match).WithOne(m => m.MatchResult).HasForeignKey<MatchResult>(mr => mr.MatchId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(mr => mr.WinnerTeam).WithMany().HasForeignKey(mr => mr.WinnerTeamId).OnDelete(DeleteBehavior.SetNull);
    }
}
