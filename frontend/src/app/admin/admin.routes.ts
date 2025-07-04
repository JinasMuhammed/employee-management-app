import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
    {
    path: 'employees',
    loadChildren: () =>
      import('./employees/admin-employees.routes').then((m) => m.ADMIN_EMPLOYEES_ROUTE),
  },
  { path: '**', component: Page404Component },
];
