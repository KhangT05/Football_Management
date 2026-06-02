using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);

        builder.ToTable("Users");

        builder.Property(e => e.Name).IsRequired(true).HasMaxLength(MaxLength.Default);
        builder.Property(e => e.Email).IsRequired(true).HasMaxLength(MaxLength.Short);
        builder.Property(e => e.Password).IsRequired(true).HasMaxLength(MaxLength.Credential);
        builder.Property(e => e.Phone).IsRequired(false).HasMaxLength(MaxLength.Phone);
        builder.HasOne(u => u.Role)
            .WithMany()
            .HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Restrict);
    }
}