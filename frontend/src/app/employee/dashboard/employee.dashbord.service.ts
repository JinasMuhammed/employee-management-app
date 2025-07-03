
// src/app/services/employee.service.ts

import { Injectable }               from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse }          from '@angular/common/http';
import { catchError, map, tap }                  from 'rxjs/operators';
import { environment }          from '../../../environments/environment';
import { Employee} from '../../admin/employees/all-employees/employees.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDashboardService {
  private readonly API_URL = `${environment.apiUrl}/Employees`;


  constructor(private http: HttpClient,) {}

 

 getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/me`);
  }


  /** Centralized error handling */
  private handleError(error: HttpErrorResponse) {
    console.error('Server error:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
