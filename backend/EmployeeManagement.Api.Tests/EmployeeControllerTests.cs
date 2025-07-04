using System;
using System.Linq;
using System.Threading.Tasks;
using EmployeeManagement.API.Controllers;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EmployeeManagement.Api.Tests
{
    public class EmployeeControllerTests
    {
        private AppDbContext BuildContext(string name) =>
            new AppDbContext(new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(name)
                .Options);

        [Fact]
        public async Task GetAll_ReturnsSeededEmployee()
        {
            // arrange: seed lookups and one employee
            var ctx = BuildContext(nameof(GetAll_ReturnsSeededEmployee));
            ctx.Departments.Add(new Department { Id = 1, Name = "IT" });
            ctx.Designations.Add(new Designation { Id = 1, Title = "Dev" });
            ctx.Roles.Add(new Role { Id = 1, Name = "Admin" });
            await ctx.SaveChangesAsync();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "a@b.com",
                PasswordHash = "pw",
                RoleId = 1
            };
            ctx.Users.Add(user);
            ctx.Employees.Add(new Employee
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                FirstName = "X",
                LastName = "Y",
                DepartmentId = 1,
                DesignationId = 1,
                RoleId = 1,
                DateOfJoining = DateTime.Today,
                Phone = "1234567890"
            });
            await ctx.SaveChangesAsync();

            var controller = new EmployeesController(ctx);

            // act
            var ok = await controller.GetAll() as OkObjectResult;

            // assert
            Assert.NotNull(ok);
            var list = Assert.IsAssignableFrom<System.Collections.IEnumerable>(ok.Value);
            Assert.Single(list);
        }

        [Fact]
        public async Task Create_DuplicateEmail_ReturnsProblemDetails()
        {
            // arrange: seed lookups
            var ctx = BuildContext(nameof(Create_DuplicateEmail_ReturnsProblemDetails));
            ctx.Departments.Add(new Department { Id = 1, Name = "D" });
            ctx.Designations.Add(new Designation { Id = 1, Title = "T" });
            ctx.Roles.Add(new Role { Id = 1, Name = "R" });
            await ctx.SaveChangesAsync();

            // add an existing user
            ctx.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "dup@x.com",
                PasswordHash = "hash",
                RoleId = 1
            });
            await ctx.SaveChangesAsync();

            var controller = new EmployeesController(ctx);
            var dto = new CreateEmployeeDto
            {
                FirstName = "F",
                LastName = "L",
                Email = "dup@x.com",
                Password = "pass123",
                DepartmentId = 1,
                DesignationId = 1,
                RoleId = 1,
                DateOfJoining = DateTime.Today,
                Phone = "1234567890"
            };

            // act
            var bad = await controller.Create(dto) as BadRequestObjectResult;

            // assert
            Assert.NotNull(bad);

            var problem = Assert.IsType<ProblemDetails>(bad.Value);
            Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
            Assert.Equal("Email already in use.", problem.Title);

            // no assertion on Detail, as it's framework-generated
        }

        [Fact]
        public async Task Create_ValidDto_ReturnsCreated()
        {
            // arrange: seed lookups
            var ctx = BuildContext(nameof(Create_ValidDto_ReturnsCreated));
            ctx.Departments.Add(new Department { Id = 1, Name = "D" });
            ctx.Designations.Add(new Designation { Id = 1, Title = "T" });
            ctx.Roles.Add(new Role { Id = 1, Name = "R" });
            await ctx.SaveChangesAsync();

            var controller = new EmployeesController(ctx);
            var dto = new CreateEmployeeDto
            {
                FirstName = "testfname",
                LastName = "testLname",
                Email = "new@x.com",
                Password = "123456",
                DepartmentId = 1,
                DesignationId = 1,
                RoleId = 1,
                DateOfJoining = DateTime.Today,
                Phone = "1234567890"
            };

            // act
            var created = await controller.Create(dto) as CreatedAtActionResult;

            // assert
            Assert.NotNull(created);
            Assert.Equal(nameof(controller.GetById), created.ActionName);

            var emp = Assert.IsType<Employee>(created.Value);
            var storedUser = ctx.Users.Single(u => u.Id == emp.UserId);
            Assert.Equal(dto.Email, storedUser.Email);
        }
    }
}
