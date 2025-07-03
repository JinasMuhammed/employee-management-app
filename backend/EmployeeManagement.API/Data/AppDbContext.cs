using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Designation> Designations { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            var adminUserId = new Guid("11111111-1111-1111-1111-111111111111");
            b.Entity<User>().HasData(new User
            {
                Id = adminUserId,
                Email = "admin@gmail.com",
                // bcrypt hash of “Admin123!” 
                PasswordHash = "$2b$12$VMWj2O3RDiEhdttO5T7yXex29MNOjOWZzxPv1RAFPXFQgGPTlaY3a",
                RoleId = 1
            });
            b.Entity<User>()
             .HasOne(u => u.Employee)
             .WithOne(e => e.User)
             .HasForeignKey<Employee>(e => e.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.Entity<User>()
             .HasOne(u => u.Role)
             .WithMany(r => r.Users)
             .HasForeignKey(u => u.RoleId)
             .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Employee>()
             .HasOne(e => e.Role)
             .WithMany(r => r.Employees)
             .HasForeignKey(e => e.RoleId)
             .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Employee>()
             .HasOne(e => e.Department)
             .WithMany(d => d.Employees)
             .HasForeignKey(e => e.DepartmentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<Employee>()
             .HasOne(e => e.Designation)
             .WithMany(ds => ds.Employees)
             .HasForeignKey(e => e.DesignationId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Employee" }
            );

            b.Entity<Department>().HasData(
                new Department { Id = 1, Name = "HR" },
                new Department { Id = 2, Name = "IT" },
                new Department { Id = 3, Name = "Finance" },
                new Department { Id = 4, Name = "Marketing" },
                new Department { Id = 5, Name = "Sales" },
                new Department { Id = 6, Name = "Legal" }
            );

            b.Entity<Designation>().HasData(
                new Designation { Id = 1, Title = "Manager" },
                new Designation { Id = 2, Title = "Software Engineer" },
                new Designation { Id = 3, Title = "Accountant" },
                new Designation { Id = 4, Title = "Marketing Executive" },
                new Designation { Id = 5, Title = "Sales Executive" },
                new Designation { Id = 6, Title = "Legal Advisor" }
            );
        }
    }
}
