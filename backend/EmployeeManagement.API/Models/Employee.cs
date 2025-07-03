namespace EmployeeManagement.API.Models
{
    public class Employee
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }           // FK → User
        public User User { get; set; } = null!;

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public int DepartmentId { get; set; }         
        public Department Department { get; set; } = null!;

        public int DesignationId { get; set; }           
        public Designation Designation { get; set; } = null!;
        public DateTime DateOfJoining { get; set; }
        public int RoleId { get; set; }           
        public Role Role { get; set; } = null!;

        public string Phone { get; set; }
    }
}
