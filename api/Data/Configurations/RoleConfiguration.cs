using Football_Management.API.Common;
using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

public class RoleConfiguration : BaseEntityConfiguration<Role>
{
    public override void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.Property(r => r.Name).IsRequired().HasMaxLength(MaxLength.Default);
        builder.Property(r => r.Description).HasMaxLength(MaxLength.Summary);
    }
}
