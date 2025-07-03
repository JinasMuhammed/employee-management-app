export class Employee {
  id: string = '';

  userId: string = '';

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  /** Lookup FKs */
  departmentId: number = 0;
  designationId: number = 0;
  roleId: number = 0;

  dateOfJoining: Date = new Date();

  departmentName?: string;
  designationTitle?: string;
  roleName?: string;
 phone: string='';
  constructor(init: Partial<Employee> = {}) {
    Object.assign(this, init);
  }
}
    
   