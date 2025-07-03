namespace EmployeeManagement.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;    // login
        public string PasswordHash { get; set; } = null!;
        public int RoleId { get; set; }            // FK → Role
        public Role Role { get; set; } = null!;

        // one-to-one back to Employee
        public Employee? Employee { get; set; }
    }
}
