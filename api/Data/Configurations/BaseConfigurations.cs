using DoAnTotNghiep.API.Models.Entities.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoAnTotNghiep.API.Data.Configuration;

public abstract class BaseEntityConfiguration<T> : IEntityTypeConfiguration<T>
where T : BaseEntities
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.UpdatedAt).IsRequired(false);
    }
}
public abstract class AuditableEntityConfiguration<T> : BaseEntityConfiguration<T>
where T : AuditableEntity
{
    public override void Configure(EntityTypeBuilder<T> builder)
    {
        base.Configure(builder);
        builder.Property(e => e.CreatedBy).IsRequired(false);
        builder.Property(e => e.UpdatedBy).IsRequired(false);
    }
}