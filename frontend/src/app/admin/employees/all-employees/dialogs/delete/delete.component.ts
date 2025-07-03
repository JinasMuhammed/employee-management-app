import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeService } from '../../employees.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
firstName: any;
lastName:any;
  id: string;
  // name: string;
  department: string;
  mobile: string;
}

@Component({
    selector: 'app-employees-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class EmployeesDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public EmployeeService: EmployeeService
  ) {}

  confirmDelete(): void {
    this.EmployeeService.deleteEmployee(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
