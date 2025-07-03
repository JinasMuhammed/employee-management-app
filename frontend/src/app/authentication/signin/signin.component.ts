import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';                
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Role } from '@core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
     MatCardModule,
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  authForm!: UntypedFormGroup;
  loading   = false;
  submitted = false;
  hide      = true;      
  error     = '';     

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
  
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.authForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error     = '';

    if (this.authForm.invalid) {
      this.error = 'Username and password are required';
      return;
    }

    this.loading = true;

    this.authService.login(
      this.f['username'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        const role = this.authService.currentUserValue?.role;
        const dest = role === Role.Admin
                   ? '/admin/dashboard/main'
                   : '/employee/dashboard';
        this.router.navigate([dest]);
      },
      error: (msg: string) => {
        this.error = msg;
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
