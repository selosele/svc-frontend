import { Routes } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';

/** 메인 라우터 */
export const indexRoutes: Routes = [
  
  // 메인 페이지
  {
    path: 'index',
    canActivate: [AuthGuard],
    loadComponent: () => import('./index.component').then(x => x.IndexComponent),
  },
];
