using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Repositories.Interfaces;

public interface IBaseRepository<TEntity>
where TEntity : BaseEntity
{
    Task<TEntity?> FindAsync(int Id);
    Task<TEntity?> FindOrFailAsync(int Id);
    Task<List<TEntity>> GetAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Remove(TEntity entity);
    IQueryable<TEntity> Query();
    void Restore(TEntity entity);
    void RemovePermanently(TEntity entity);
    /// <summary>
    /// Khôi phục nhiều bản ghi đã xóa mềm
    /// Restore multiple soft-deleted records
    /// IEnumerable<TEntity> entities: 
    /// A collection of entities to be restored.
    ///  This parameter represents the list of entities that have been soft
    /// -deleted and need to be restored. Each entity in the collection 
    /// should have its state set to indicate that it is being restored.
    /// </summary>
    /// <param name="entities"></param>
    void RestoreRange(IEnumerable<TEntity> entities);
    // Task AddRangeAsync(IEnumerable<TEntity> entities);
    // void UpdateRange(IEnumerable<TEntity> entities);
    // void RemoveRange(IEnumerable<TEntity> entities);

}