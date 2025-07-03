using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class DesignationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public DesignationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Designations.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var des = await _db.Designations.FindAsync(id);
        return des == null ? NotFound() : Ok(des);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Designation des)
    {
        _db.Designations.Add(des);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = des.Id }, des);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Designation dto)
    {
        if (id != dto.Id) return BadRequest();
        _db.Entry(dto).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var des = await _db.Designations.FindAsync(id);
        if (des == null) return NotFound();
        _db.Designations.Remove(des);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
