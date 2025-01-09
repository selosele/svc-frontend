import { Routes } from '@angular/router';
import { authGuard, menuGuard } from '@app/shared/guards';

/** 메인 라우터 */
export const indexRoutes: Routes = [
  
  // 메인 페이지
  {
    path: 'index',
    canActivate: [authGuard, menuGuard],
    loadComponent: () => import('./index.component').then(x => x.IndexComponent),
  },
];
