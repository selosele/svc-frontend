import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authRoutes } from './auth/auth.routes';
import { indexRoutes } from './index/index.routes';
import { humanRoutes } from './human/human.routes';
import { salaryRoutes } from './salary/salary.routes';
import { articleRoutes } from './article/article.routes';
import { systemRoutes } from './system/system.routes';
import { ERROR_PAGE_PATH } from './shared/utils';

/** 공통 라우터 */
const globalRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: '',
    component: AppComponent,
  },
  {
    path: ERROR_PAGE_PATH.replace('/', ''),
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
  ...humanRoutes,    // 인사관리 페이지
  ...salaryRoutes,   // 급여관리 페이지
  ...articleRoutes,  // 게시글 페이지
  ...systemRoutes,   // 시스템관리 페이지
  ...globalRoutes,   // 공통
];
