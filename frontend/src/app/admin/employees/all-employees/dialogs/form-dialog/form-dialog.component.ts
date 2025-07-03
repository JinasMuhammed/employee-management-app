import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeeService } from '../../employees.service';
import { Employee } from '../../employees.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
export interface DialogData {
  id: number;
  action: string;
  employees: Employee;
}

@Component({
  selector: 'app-employees-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogClose,
  ],
})
export class EmployeesFormComponent implements OnInit {
  action: string;
  dialogTitle: string;
  employeeForm: UntypedFormGroup;
  employees: Employee;
  roles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmployeesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private employeeService: EmployeeService,
    private fb: UntypedFormBuilder,
     private snackBar: MatSnackBar
  ) {
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Employee' : 'New Employee';
    this.employees = data.employees || new Employee({});
    this.employeeForm = this.createEmployeeForm();
  }

  ngOnInit(): void {
    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.employeeService.getRoles().subscribe(data => (this.roles = data));
    this.employeeService.getDepartments().subscribe(data => (this.departments = data));
    this.employeeService.getDesignations().subscribe(data => (this.designations = data));
  }

  createEmployeeForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.employees.id || ''],
      userId: [this.employees.userId || ''],
      firstName: [this.employees.firstName || '', Validators.required],
      lastName: [this.employees.lastName || '', Validators.required],
      email: [
        this.employees.email || '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: [
        this.employees.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
      departmentId: [this.employees.departmentId || '', Validators.required],
      designationId: [this.employees.designationId || '', Validators.required],
      roleId: [this.employees.roleId || '', Validators.required],
      dateOfJoining: [this.employees.dateOfJoining || '', Validators.required],
      phone:         [this.employees.phone       || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email';
    return '';
  }

submit(): void {
  if (this.employeeForm.invalid) return;

  const formData = this.employeeForm.getRawValue();

  const request$ = this.action === 'edit'
    ? this.employeeService.updateEmployee(formData)
    : this.employeeService.addEmployee(formData);

  request$.subscribe({
    next: response => {
      this.dialogRef.close(response);
      
    },
  error: (message: string) => {
  
    }
  });
}


  onNoClick(): void {
    this.employeeForm.reset();
    this.dialogRef.close();
  }
}
