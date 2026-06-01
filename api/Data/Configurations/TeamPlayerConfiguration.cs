// using Football_Management.API.Common;
// using Football_Management.API.Data.Configuration;
// using Football_Management.API.Models.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace Football_Management.API.Data.Configurations;

// public class TeamPlayerConfiguration : IEntityTypeConfiguration<TeamPlayer>
// {
//     public void Configure(EntityTypeBuilder<TeamPlayer> builder)
//     {
//         // base.Configure(builder);

//         builder.ToTable("TeamPlayers");

//         builder.HasKey(tp => new { tp.TeamId, tp.PlayerId });
//         builder.Property(tp => tp.JerseyNumber).IsRequired();
//         builder.Property(tp => tp.Position).IsRequired().HasMaxLength(MaxLength.Short);
//         builder.Property(tp => tp.Role).IsRequired().HasMaxLength(MaxLength.Short);
//         builder.Property(tp => tp.Status).IsRequired().HasMaxLength(MaxLength.Short);

//         builder.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);
//         builder.Property(e => e.CreatedAt).IsRequired();
//         builder.Property(e => e.UpdatedAt).IsRequired(false);

//         builder.Property(e => e.CreatedBy).IsRequired(false);
//         builder.Property(e => e.UpdatedBy).IsRequired(false);

//         builder.Property(e => e.DeletedAt).IsRequired(false);
//         builder.Property(e => e.DeletedBy).IsRequired(false);
//         builder.Property(e => e.IsDeleted).HasDefaultValue(false);

//         builder.HasOne<User>()
//             .WithMany()
//             .HasForeignKey(e => e.CreatedBy)
//             .OnDelete(DeleteBehavior.NoAction)
//             .IsRequired(false);

//         builder.HasOne<User>()
//             .WithMany()
//             .HasForeignKey(e => e.UpdatedBy)
//             .OnDelete(DeleteBehavior.NoAction)
//             .IsRequired(false);

//         builder.HasOne<User>()
//             .WithMany()
//             .HasForeignKey(e => e.DeletedBy)
//             .OnDelete(DeleteBehavior.NoAction)
//             .IsRequired(false);

//         builder.HasQueryFilter(e => !e.IsDeleted);
//         builder.HasOne(tp => tp.Team).WithMany(t => t.TeamPlayers)
//             .HasForeignKey(tp => tp.TeamId).OnDelete(DeleteBehavior.Cascade);
//         builder.HasOne(tp => tp.Player).WithMany(p => p.TeamPlayers)
//             .HasForeignKey(tp => tp.PlayerId).OnDelete(DeleteBehavior.Cascade);
//     }
// }
