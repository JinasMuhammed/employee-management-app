namespace EmployeeManagement.API.Models
{
    public class CreateEmployeeDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; 
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public int RoleId { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string Phone { get; set; } = null!;
    }
}
