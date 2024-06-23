import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authRoutes } from './auth/auth.routes';
import { systemRoutes } from './system/system.routes';
import { indexRoutes } from './index/index.routes';

/** 공통 라우터 */
const globalRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: '',
    component: AppComponent,
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
  ...indexRoutes,  // 메인 페이지
  ...systemRoutes, // 시스템관리
  ...globalRoutes, // 공통
];
