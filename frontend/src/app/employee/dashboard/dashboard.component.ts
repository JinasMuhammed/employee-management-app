import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent
} from 'ng-apexcharts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { EmployeeDashboardService } from './employee.dashbord.service'
import { Employee } from '../../admin/employees/all-employees/employees.model';
import { CommonModule } from '@angular/common';
   
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
       BreadcrumbComponent,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        CommonModule
    ]
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  employee!: Employee;
// profile$!: Observable<Employee>;
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Employee'],
      active: 'Dashboard',
    },
  ];

  constructor(private service: EmployeeDashboardService) {
    //constructor
  }
  ngOnInit() {
   // 1️⃣ Subscribe to get the details into a local variable:
    this.service.getMyProfile().subscribe({
      next: emp => {
        this.employee = emp;
        console.log('Logged‐in employee details:', emp);
      },
      error: err => console.error('Failed to load profile', err)
    });

    // Or, if you only need it in the template, you can omit the above
    // and just bind `profile$ | async` in your HTML.
  }
  }


