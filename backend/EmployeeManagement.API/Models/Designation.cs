namespace EmployeeManagement.API.Models
{
    public class Designation
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
