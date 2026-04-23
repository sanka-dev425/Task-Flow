using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasIndex(t => t.UserId).HasDatabaseName("idx_tasks_user_id");
            entity.HasIndex(t => new { t.UserId, t.IsCompleted }).HasDatabaseName("idx_tasks_user_completed");

            entity.Property(t => t.Id)
                  .HasColumnType("char(36)")
                  .ValueGeneratedNever();

            entity.Property(t => t.Priority)
                  .HasColumnType("varchar(20)")
                  .HasDefaultValue("medium");

            entity.Property(t => t.DueDate).HasColumnType("datetime(6)");

            entity.Property(t => t.CreatedAt).HasColumnType("datetime(6)");
            entity.Property(t => t.UpdatedAt).HasColumnType("datetime(6)");
        });
    }
}
