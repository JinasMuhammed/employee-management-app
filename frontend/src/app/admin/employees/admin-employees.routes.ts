import { Route } from '@angular/router';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
// import { AboutEmployeesComponent } from './about-employees/about-employees.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_EMPLOYEES_ROUTE: Route[] = [
  {
    path: 'all-employees',
    component: AllEmployeesComponent,
  },


  // {
  //   path: 'about-employees',
  //   component: AboutEmployeesComponent,
  // },
  { path: '**', component: Page404Component },
];
