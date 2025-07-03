import { AuthService } from '../service/auth.service';
import { Injectable }   from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError }             from 'rxjs/operators';
import { MatSnackBar }            from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackBar:  MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.logout();
        }

        let message = 'An unexpected error occurred';

        if (err.error && typeof err.error === 'object') {
          message = err.error.title || err.error.detail || err.error.message || message;
        }
        else if (typeof err.error === 'string') {
          message = err.error.trim();
        }
        else if (err.statusText && err.statusText !== 'OK') {
          message = err.statusText;
        }

        this.snackBar.open(message, 'Close', {
          panelClass: ['snackbar-error'],
          duration:    5000,
          horizontalPosition: 'center',
          verticalPosition:   'top'
        });

        // 4) Propagate so components can still handle if needed
        return throwError(() => message);
      })
    );
  }
}
