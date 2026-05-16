using DoAnTotNghiep.API.Data;
using DoAnTotNghiep.API.Models.Entities;
using DoAnTotNghiep.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.API.Services.Implements;

public abstract class BaseService<TEntity> where TEntity : BaseEntities
{
    protected readonly AppDbContext _context;
    protected readonly IBaseRepository<TEntity> _repository;

    protected BaseService(AppDbContext context, IBaseRepository<TEntity> repository)
    {
        _context = context;
        _repository = repository;
    }

    /// <summary>
    /// Validate business rules before saving
    /// </summary>
    protected virtual Task BeforeSaveAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    /// <summary>
    /// Handle side effects after saving
    /// </summary>
    protected virtual Task AfterSaveAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    /// <summary>
    /// Execute operations within a transaction
    /// </summary>
    protected async Task InTransactionAsync(Func<Task> action, CancellationToken cancellationToken = default)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            await action();
            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <summary>
    /// Save changes to database (call this only once at the end)
    /// </summary>
    protected async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}