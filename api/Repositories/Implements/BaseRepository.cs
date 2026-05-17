using DoAnTotNghiep.API.Data;
using Microsoft.EntityFrameworkCore;
using DoAnTotNghiep.API.Common.Exceptions;
using DoAnTotNghiep.API.Repositories.Interfaces;
using DoAnTotNghiep.API.Models.Entities.Base;
namespace DoAnTotNghiep.API.Repositories.Implements;

public class BaseRepository<TEntity> : IBaseRepository<TEntity>
    where TEntity : BaseEntity
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<TEntity> _dbSet;
    public BaseRepository(
        AppDbContext db
    )
    {
        _db = db;
        _dbSet = db.Set<TEntity>();
    }
    public async Task<TEntity?> FindAsync(int Id)
        => await _dbSet.FindAsync(Id);
    public async Task<TEntity?> FindOrFailAsync(int Id)
    => await _dbSet.FindAsync(Id)
    ?? throw new NotFoundException($"{typeof(TEntity).Name} #{Id} không tồn tại.");
    public IQueryable<TEntity> Query() => _dbSet.AsQueryable();
    public async Task<List<TEntity>> GetAllAsync() => await _dbSet.ToListAsync();
    public async Task<TEntity> AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }

    public void Update(TEntity entity) => _db.Entry(entity).State = EntityState.Modified;
    public void Remove(TEntity entity) => _dbSet.Remove(entity);
    public void Restore(TEntity entity)
    {
        // entity.IsDeleted = false;
        Update(entity);
    }
    public void RemovePermanently(TEntity entity) => _dbSet.Remove(entity);
    public void RestoreRange(IEnumerable<TEntity> entities)
    {
        //foreach (var entity in entities)
        {//
         // entity.IsDeleted = false;
         //Update(entity);
        }// Cách tối ưu hơn: sử dụng LINQ để cập nhật tất cả các entity trong một lần gọi
        //foreach (var entity in entities)
        {
            //  entity.IsDeleted = false;
        }// Sau đó, gọi UpdateRange để cập nhật tất cả các entity đã được đánh dấu là không bị xóa
        //UpdateRange(entities);// Cách tối ưu hơn: sử dụng LINQ để cập nhật
        //  tất cả các entity trong một lần gọi

    }

    // public void UpdateRange(IEnumerable<TEntity> entities)
    // {
    //     foreach (var entity in entities)
    //         _db.Entry(entity).State = EntityState.Modified;
    // }
    // public async Task AddRangeAsync(IEnumerable<TEntity> entities) 
    // => await _dbSet.AddRangeAsync(entities);
    // public void RemoveRange(IEnumerable<TEntity> entities) => _dbSet.RemoveRange(entities);
}