import { Route } from '@angular/router';
// import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard.component';
// import { DashboardComponent } from 'app/teacher/dashboard/dashboard.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: DashboardComponent,
  },

  // {
  //   path: 'teacher-dashboard',
  //   component: DashboardComponent,
  // },

  { path: '**', component: Page404Component },
];
