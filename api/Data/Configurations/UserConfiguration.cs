using DoAnTotNghiep.API.Common;
using DoAnTotNghiep.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configuration;

public class UserConfiguration : BaseEntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);
        builder.ToTable("Users");
        builder.Property(e => e.Name).IsRequired(true).HasMaxLength(MaxLength.Name.Default);
        builder.Property(e => e.Email).IsRequired(true).HasMaxLength(MaxLength.Contact.Email);
        builder.Property(e => e.Password).IsRequired(true).HasMaxLength(MaxLength.System.Password);
        builder.Property(e => e.Phone).IsRequired(false).HasMaxLength(MaxLength.Contact.Phone);
        builder.HasMany(u => u.UserRoles).WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}