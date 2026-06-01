using System.Diagnostics;
using System.Security.Claims;
using Football_Management.API.Models.Entities.Base;
using Football_Management.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Football_Management.API.Controllers.Base;

[ApiController]
public abstract class BaseController<TEntity, TResponse, TCreateRequest, TUpdateRequest>
    : ControllerBase
    where TEntity : BaseEntity
{
    protected readonly IBaseService<TEntity, TResponse, TCreateRequest, TUpdateRequest> Service;
    protected readonly ILogger Logger;

    protected BaseController(
        IBaseService<TEntity, TResponse, TCreateRequest, TUpdateRequest> service,
        ILogger logger
        )
    {
        Service = service;
        Logger = logger;
    }

    // ── CRUD ──────────────────────────────────────────────────────
    [Authorize]
    [HttpGet]
    public virtual async Task<IActionResult> GetAll()
    {
        var sw = Stopwatch.StartNew();
        var result = await Service.GetAllAsync();
        Logger.LogInformation("{Entity} GetAll {Elapsed}ms", typeof(TEntity).Name, sw.ElapsedMilliseconds);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{id}")]
    public virtual async Task<IActionResult> GetById(int id)
    {
        var sw = Stopwatch.StartNew();
        var result = await Service.GetByIdAsync(id);
        Logger.LogInformation("{Entity} GetAll {Elapsed}ms", typeof(TEntity).Name, sw.ElapsedMilliseconds);
        return Ok(result);
    }
    [Authorize]
    [HttpPost]
    public virtual async Task<IActionResult> Create([FromBody] TCreateRequest request)
    {
        var sw = Stopwatch.StartNew();
        var result = await Service.CreateAsync(request);
        Logger.LogInformation("{Entity} Created {Elapsed}ms",
            typeof(TEntity).Name, sw.ElapsedMilliseconds);
        return StatusCode(201, result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public virtual async Task<IActionResult> Update(int id, [FromBody] TUpdateRequest request)
    {
        var sw = Stopwatch.StartNew();
        var result = await Service.UpdateAsync(id, request);
        Logger.LogInformation("{Entity}#{Id} Updated {Elapsed}ms",
            typeof(TEntity).Name, id, sw.ElapsedMilliseconds);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        var sw = Stopwatch.StartNew();
        await Service.DeleteAsync(id);
        Logger.LogInformation("{Entity}#{Id} Deleted {Elapsed}ms",
            typeof(TEntity).Name, id, sw.ElapsedMilliseconds);
        return NoContent();
    }

    // [HttpPatch("{id}/restore")]
    // public virtual async Task<IActionResult> Restore(int id)
    // {
    //     await Service.RestoreAsync(id);
    //     return NoContent();
    // }

    // [HttpDelete("{id}/permanent")]
    // public virtual async Task<IActionResult> DeletePermanently(int id)
    // {
    //     await Service.DeletePermanentlyAsync(id);
    //     return NoContent();
    // }
}