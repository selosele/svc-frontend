import { Routes } from '@angular/router';
import { authRoutes } from '@app/auth/auth.routes';
import { AuthGuard } from './shared/guards';

/** 공통 라우터 */
const globalRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./app.component').then(x => x.AppComponent),
  },
  {
    path: 'error',
    loadComponent: () => import('./error/error.component').then(x => x.ErrorComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./error/error.component').then(x => x.ErrorComponent),
  },
];

export const routes: Routes = [
  ...authRoutes,   // 인증
  ...globalRoutes, // 공통
];
