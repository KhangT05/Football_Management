using Football_Management.API.Models.Entities;
using Football_Management.API.Models.Entities.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;

/// <summary>
/// Base configuration cho tất cả entity kế thừa <see cref="BaseEntity"/>.
///
/// Lý do dùng <see cref="IEntityTypeConfiguration{T}"/> thay vì cấu hình
/// trực tiếp trong OnModelCreating:
/// - Tách biệt mapping logic ra khỏi DbContext — tránh God method 200+ dòng
/// - Mỗi entity có 1 file configuration riêng, dễ tìm và maintain
/// - Base class enforce convention chung (PK, soft delete, timestamp)
///   cho toàn bộ hệ thống — không bỏ sót khi thêm entity mới
/// - DbContext chỉ cần 1 dòng:
///   modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly())
/// </summary>
public abstract class BaseEntityConfiguration<T> : IEntityTypeConfiguration<T>
where T : BaseEntity
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
/// <summary>
/// Configuration cho các entity cần audit trail: biết ai tạo, ai sửa lần cuối.
/// Kế thừa <see cref="BaseEntityConfiguration{T}"/> và bổ sung FK tới
/// <see cref="User"/>.
///
/// Lý do chọn <see cref="DeleteBehavior.SetNull"/>:
/// - Restrict: chặn xóa user nếu còn record liên quan — quá cứng,
///   không thể offboard nhân sự
/// - Cascade: xóa user kéo theo xóa toàn bộ record họ tạo/sửa — nguy hiểm,
///   mất dữ liệu nghiệp vụ
/// - SetNull: xóa user thì audit field về null, record vẫn còn nguyên —
///   đúng với yêu cầu giữ lịch sử
///
/// Lý do không có navigation property ngược (WithMany không tham số):
/// User không cần biết mình đã tạo/sửa những bảng nào.
/// Nếu map ngược, User sẽ có hàng chục ICollection (Tournament, Season,
/// Match, Player...) — noise, không có use case thực tế nào cần traversal đó.
/// EF Core vẫn resolve FK và cho phép query mà không cần nav property ngược.
/// </summary>
public abstract class AuditableEntityConfiguration<T> : BaseEntityConfiguration<T>
where T : AuditableEntity
{
    public override void Configure(EntityTypeBuilder<T> builder)
    {
        base.Configure(builder);

        builder.Property(e => e.CreatedBy).IsRequired(false);
        builder.Property(e => e.UpdatedBy).IsRequired(false);

        builder.Property(e => e.DeletedAt).IsRequired(false);
        builder.Property(e => e.DeletedBy).IsRequired(false);
        builder.Property(e => e.IsDeleted).HasDefaultValue(false);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CreatedBy)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UpdatedBy)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.DeletedBy)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}