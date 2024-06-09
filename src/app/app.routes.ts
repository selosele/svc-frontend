import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards';
import { authRoutes } from './auth/auth.routes';
import { indexRoutes } from './index/index.routes';

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
  ...indexRoutes,  // 메인
  ...globalRoutes, // 공통
];
