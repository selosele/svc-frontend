import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    loadComponent: () => import('./app.component').then(x => x.AppComponent),
    canActivate: [AuthGuard],
  }
];
