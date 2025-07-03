// src/app/services/employee.service.ts

import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  throwError
} from 'rxjs';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { Employee } from './employees.model';

export interface Department {
  id:   number;
  name: string;
}

export interface Designation {
  id:    number;
  title: string;
}

export interface Role {
  id:   number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly API_URL = `${environment.apiUrl}/Employees`;

  /** client‐side cache & notification stream */
  dataChange = new BehaviorSubject<Employee[]>([]);

  constructor(private http: HttpClient) {}

  /** GET: all employees */
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL).pipe(
      // convert ISO strings → Date for display if you like
      map(list =>
        list.map(emp => ({
          ...emp,
          dateOfJoining: new Date(emp.dateOfJoining) as any
        }))
      ),
      tap(list => this.dataChange.next(list)),
      catchError(err => this.handleError(err))
    );
  }

  /** POST: add a new employee */
  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, emp).pipe(
      tap(newEmp => {
        this.dataChange.next([...this.dataChange.value, newEmp]);
      }),
      catchError((err: HttpErrorResponse) => {
       
      console.log('from service',err);
        const msg = typeof err.error === 'string'
                  ? err.error.trim()
                  : err.error?.message
                  || 'An unexpected error occurred';
        return throwError(() => msg);
      })
    );
  }

  /** PUT: update an existing employee */
  updateEmployee(emp: Employee): Observable<Employee> {
    if (!emp?.id) {
      return throwError(() => 'Invalid employee data.');
    }

    return this.http.put<Employee>(`${this.API_URL}/${emp.id}`, emp).pipe(
      tap(updated => {
        const list = this.dataChange.value.map(e =>
          e.id === updated.id ? updated : e
        );
        this.dataChange.next(list);
      }),
      catchError((err: HttpErrorResponse) => {
      console.log('from service',err);
        const msg = typeof err.error === 'string'
                  ? err.error.trim()
                  : err.error?.message
                  || 'An unexpected error occurred';
        return throwError(() => msg);
      })
    );
  }

  /** DELETE: remove an employee by ID */
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.dataChange.next(
          this.dataChange.value.filter(e => e.id !== id)
        );
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Lookups */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}/roles`);
  }
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${environment.apiUrl}/departments`);
  }
  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(
      `${environment.apiUrl}/designations`
    );
  }

  /** Shared error handler for GET/DELETE */
  private handleError(err: HttpErrorResponse) {
    console.error('EmployeeService error', err);
    let msg = 'An unknown error occurred';
    if (typeof err.error === 'string' && err.error.trim()) {
      msg = err.error.trim();
    } else if (err.error?.message) {
      msg = err.error.message;
    }
    return throwError(() => msg);
  }
}
