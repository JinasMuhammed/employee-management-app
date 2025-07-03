using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public DepartmentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Departments.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var dept = await _db.Departments.FindAsync(id);
        return dept == null ? NotFound() : Ok(dept);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Department dept)
    {
        _db.Departments.Add(dept);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = dept.Id }, dept);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Department dto)
    {
        if (id != dto.Id) return BadRequest();
        _db.Entry(dto).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var dept = await _db.Departments.FindAsync(id);
        if (dept == null) return NotFound();
        _db.Departments.Remove(dept);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
