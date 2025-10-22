import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./components/alert-list/alert-list.component').then(m => m.AlertListComponent)
  },
  {
    path: 'alerts/:id',
    loadComponent: () => import('./components/alert-detail/alert-detail.component').then(m => m.AlertDetailComponent)
  },
  {
    path: 'alerts/:id/edit',
    loadComponent: () => import('./components/alert-detail/alert-detail.component').then(m => m.AlertDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
