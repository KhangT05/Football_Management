using Football_Management.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Football_Management.API.Data.Configurations;
// PaymentConfiguration.cs
public class PaymentConfiguration : AuditableEntityConfiguration<Payment>
{
    public override void Configure(EntityTypeBuilder<Payment> builder)
    {
        base.Configure(builder);
        builder.ToTable("Payments");

        builder.Property(p => p.Amount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(p => p.TransactionRef)
            .HasMaxLength(100)
            .IsRequired(false);

        builder.Property(p => p.PaidAt).IsRequired(false);
        builder.Property(p => p.ConfirmedAt).IsRequired(false);

        builder.HasOne(p => p.SeasonTeam)
            .WithMany()
            .HasForeignKey(p => p.SeasonTeamId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(p => p.ConfirmedBy)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired(false);
    }
}