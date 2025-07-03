using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Security.Claims;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmployeesController(AppDbContext db) => _db = db;

    // POST: /api/employees
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(typeof(Employee), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
        {
            var details = new ProblemDetails
            {
                Type = "https://your-api/errors/duplicate-email",
                Title = "Email already in use.",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Each user must have a unique email address."
            };
            return BadRequest(details);
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = dto.RoleId
        };
        _db.Users.Add(user);

        var emp = new Employee
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DepartmentId = dto.DepartmentId,
            DesignationId = dto.DesignationId,
            RoleId = dto.RoleId,
            DateOfJoining = dto.DateOfJoining,
            Phone = dto.Phone
        };
        _db.Employees.Add(emp);

        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = emp.Id }, emp);
    }

    // GEt : /api/employees
    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(typeof(object[]), 200)]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _db.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Role)
            .Include(e => e.User)
            .ToListAsync();

        var result = employees.Select(e => new
        {
            e.Id,
            e.FirstName,
            e.LastName,
            e.DateOfJoining,
            DepartmentId = e.Department.Id,
            Department = e.Department.Name,
            DesignationId = e.Designation.Id,
            Designation = e.Designation.Title,
            RoleId = e.Role.Id,
            Role = e.Role.Name,
            Email = e.User.Email,
            Phone = e.Phone
        });

        return Ok(result);
    }

    // GET: /api/employees/{id}
    [HttpGet("{id}")]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(typeof(Employee), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();
        return Ok(emp);
    }

    // GET: /api/employees/me
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Me()
    {
        var uid = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var emp = await _db.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Role)
            .Include(e => e.User)
            .Where(e => e.UserId == uid)
            .Select(e => new {
                e.Id,
                e.FirstName,
                e.LastName,
                e.DateOfJoining,
                DepartmentId = e.Department.Id,
                departmentName = e.Department.Name,
                DesignationId = e.Designation.Id,
                designationTitle = e.Designation.Title,
                RoleId = e.Role.Id,
                Role = e.Role.Name,
                Email = e.User.Email,
                Phone = e.Phone
            })
            .SingleOrDefaultAsync();

        if (emp == null) return NotFound();
        return Ok(emp);
    }

    // PUT: /api/employees/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(typeof(Employee), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateEmployeeDto dto)
    {
       
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null)
            return NotFound();

        
        var user = await _db.Users.FindAsync(emp.UserId);
        if (user == null)
            return NotFound();

        if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
        {
            var emailTaken = await _db.Users
                .AnyAsync(u => u.Email == dto.Email && u.Id != user.Id);
            if (emailTaken)
            {
                return BadRequest(new { message = "Email already in use." });
            }
        }

        user.Email = dto.Email;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.RoleId = dto.RoleId;

        emp.FirstName = dto.FirstName;
        emp.LastName = dto.LastName;
        emp.DepartmentId = dto.DepartmentId;
        emp.DesignationId = dto.DesignationId;
        emp.RoleId = dto.RoleId;
        emp.DateOfJoining = dto.DateOfJoining;
        emp.Phone = dto.Phone;
        

        await _db.SaveChangesAsync();
        return Ok(emp);
    }

    // DELETE: /api/employees/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp == null) return NotFound();

        var user = await _db.Users.FindAsync(emp.UserId)!;
        _db.Employees.Remove(emp);
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
