import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { Employee } from './employees.model';
import { EmployeeService } from './employees.service';
import { EmployeesFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { EmployeesDeleteComponent } from './dialogs/delete/delete.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { rowsAnimation, TableExportUtil } from '@shared';
import { formatDate, DatePipe, CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Direction } from '@angular/cdk/bidi';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss'],
  animations: [rowsAnimation],
  imports: [
        BreadcrumbComponent,
        // FeatherIconsComponent,
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        // NgClass,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
    ]
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    // 'select',
    'position',
    'firstName',
    'lastName',
    'email',
    'phone',
    'departmentName',
    'designationTitle',
    'dateOfJoining',
    'actions'
  ];
  dataSource = new MatTableDataSource<Employee>([]);
  selection = new SelectionModel<Employee>(true, []);
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  breadscrums = [
    { title: 'All Employees', items: ['Employees'], active: 'All Employees' }
  ];

  constructor(
    private service: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.initTable();
      },
      error: (err) => {
        this.showNotification('snackbar-danger', err.message, 'bottom', 'center');
        this.isLoading = false;
      }
    });
  }

  private initTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Employee, filter: string) =>
      Object.values(data).some(v => v?.toString().toLowerCase().includes(filter));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    this.openDialog('add');
  }

  edit(row: Employee) {
    this.openDialog('edit', row);
  }

openDialog(action: 'add' | 'edit', row?: Employee) {
  Promise.all([
    this.service.getRoles().toPromise(),
    this.service.getDepartments().toPromise(),
    this.service.getDesignations().toPromise()
  ]).then(([roles, departments, designations]) => {
    const dialogRef = this.dialog.open(EmployeesFormComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: true,
      data: {
        id: row?.id ?? null,
        action,
        employees: row || new Employee({}),
        roles,
        departments,
        designations
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.initTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'snackbar-warning',
          `${action === 'add' ? 'Added' : 'Updated'} successfully`,
          'bottom', 'center'
        );
        this.loadData();
      }
    });
  });
}


  private updateRecord(updated: Employee) {
    const index = this.dataSource.data.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      this.dataSource.data[index] = updated;
      this.dataSource._updateChangeSubscription();
    }
  }

  delete(row: Employee) {
    const dialogRef = this.dialog.open(EmployeesDeleteComponent, {
      width: '400px',
      disableClose: true,
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(e => e.id !== row.id);
        this.initTable();
        this.showNotification('snackbar-danger', 'Deleted successfully', 'bottom', 'center');
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    vertical: MatSnackBarVerticalPosition,
    horizontal: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: vertical,
      horizontalPosition: horizontal,
      panelClass: colorName
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map(x => ({
      FirstName: x.firstName,
      LastName: x.lastName,
      Email: x.email,
      Department: x.departmentName || '',
      Designation: x.designationTitle || '',
         Phone: x.phone || '',
      HireDate: formatDate(new Date(x.dateOfJoining), 'yyyy-MM-dd', 'en')
    }));
    TableExportUtil.exportToExcel(exportData, 'employees_export');
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows() {
    const count = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(e => !this.selection.selected.includes(e));
    this.selection.clear();
    this.showNotification('snackbar-danger', `${count} record(s) deleted`, 'bottom', 'center');
  }

  refresh() {
    this.loadData();
  }
}
