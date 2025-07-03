// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '@core/models/role';
import { EmployeeService } from '../../../app/admin/employees/all-employees/employees.service';  // <-- import this
import { Employee }        from '../../../app/admin/employees/all-employees/employees.model';
import { EmployeeDashboardService } from 'app/employee/dashboard/employee.dashbord.service';
// Minimal User type for auth state
export interface User {
  role:  Role;
  token: string;
  profile?: Employee;      
}

interface LoginResponse {
  token:      string;
  expiration: string;
}

interface JwtPayload {
  sub:  string;
  role: Role;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY  = 'currentUser';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public  currentUser$      = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private EmployeeDashboardService :EmployeeDashboardService    
  ) {
    const stored = localStorage.getItem(this.USER_KEY);
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  private decodeToken<T>(token: string): T | null {
    try {
      const [, payload] = token.split('.');
      return JSON.parse(atob(payload)) as T;
    } catch {
      return null;
    }
  }

  private getRoleFromToken(token: string): Role | null {
    const payload = this.decodeToken<JwtPayload>(token);
    if (!payload) return null;
    return (payload.role
         ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
         ?? null) as Role;
  }

  
login(email: string, password: string): Observable<User> {
  return this.http
    .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
    .pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => err.error || err.statusText)
      ),
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
      }),
      map(res => {
        const role = this.getRoleFromToken(res.token)!;
        const user: User = { role, token: res.token };
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return user;
      })
    );
}

  logout(): Observable<{ success: boolean }> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    return of({ success: true });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
