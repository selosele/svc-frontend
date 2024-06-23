import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authRoutes } from './auth/auth.routes';
import { systemRoutes } from './system/system.routes';
import { indexRoutes } from './index/index.routes';
import { scheduleRoutes } from './schedule/schedule.routes';

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
    loadComponent: () => import('./error/error.component').then(x => x.ErrorComponent),
  },
];

export const routes: Routes = [
  ...authRoutes,     // 인증 페이지
  ...indexRoutes,    // 메인 페이지
  ...scheduleRoutes, // 일정관리 페이지
  ...systemRoutes,   // 시스템관리 페이지
  ...globalRoutes,   // 공통
];
