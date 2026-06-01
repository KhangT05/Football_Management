using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Services.Interfaces;

public interface IBaseService<TEntity, TDto, TCreateRequest, TUpdateRequest>
    where TEntity : BaseEntity
{
    Task<List<TDto>> GetAllAsync();
    Task<TDto> GetByIdAsync(int id);
    Task<TDto> CreateAsync(TCreateRequest request);
    Task<TDto> UpdateAsync(int id, TUpdateRequest request);
    Task DeleteAsync(int id);
}