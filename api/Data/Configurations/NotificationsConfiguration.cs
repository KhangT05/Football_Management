using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// NotificationConfiguration.cs
public class NotificationConfiguration : AuditableEntityConfiguration<Notification>
{
    public override void Configure(EntityTypeBuilder<Notification> builder)
    {
        base.Configure(builder);
        builder.ToTable("Notifications");

        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Content).IsRequired().HasMaxLength(2000);
        builder.Property(n => n.IsRead).HasDefaultValue(false);
        builder.Property(n => n.RefEntityType).HasMaxLength(50).IsRequired(false);
        builder.Property(n => n.RefEntityId).IsRequired(false);

        builder.Property(n => n.Type)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(n => n.Source)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.HasOne(n => n.Season)
            .WithMany()
            .HasForeignKey(n => n.SeasonId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        builder.HasOne(n => n.TargetTeam)
            .WithMany()
            .HasForeignKey(n => n.TargetTeamId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(n => n.RecipientUserId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);

        // Query chính: unread notifications của user
        builder.HasIndex(n => new { n.RecipientUserId, n.IsRead });
        builder.HasIndex(n => new { n.SeasonId, n.Type });
    }
}