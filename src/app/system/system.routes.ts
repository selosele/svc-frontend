import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';
import { roles } from '@app/shared/utils';

/** 시스템관리 페이지 라우터 */
export const systemRoutes: Routes = [
  
  // 사용자관리 페이지
  {
    path: 'system/user',
    canActivate: [authGuard],
    data: {
      roles: [roles.systemAdmin],
    },
    loadComponent: () => import('./system-user/system-user.component').then(x => x.SystemUserComponent),
  },
];
