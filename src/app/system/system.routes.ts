import { Routes } from '@angular/router';
import { authGuard, menuGuard } from '@app/shared/guards';
import { codeResolver } from '@app/shared/resolvers';
import { roles } from '@app/shared/utils';

/** 시스템관리 페이지 라우터 */
export const systemRoutes: Routes = [
  
  // 사용자관리 페이지
  {
    path: 'system/users',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.SYSTEM_ADMIN],
      codeKeys: ['GENDER_00', 'RANK_00', 'JOB_TITLE_00'],
    },
    loadComponent: () => import('./system-user/system-user.component').then(x => x.SystemUserComponent),
  },
  // 권한관리 페이지
  {
    path: 'system/roles',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.SYSTEM_ADMIN],
    },
    loadComponent: () => import('./system-role/system-role.component').then(x => x.SystemRoleComponent),
  },
  // 코드관리 페이지
  {
    path: 'system/codes',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.SYSTEM_ADMIN],
    },
    loadComponent: () => import('./system-code/system-code.component').then(x => x.SystemCodeComponent),
  },
  
];
