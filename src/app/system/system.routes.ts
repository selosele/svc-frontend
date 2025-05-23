import { Routes } from '@angular/router';
import { authGuard, menuGuard } from '@app/shared/guards';
import { codeResolver } from '@app/shared/resolvers';
import { roles } from '@app/shared/utils';

/** 시스템관리 페이지 라우터 */
export const systemRoutes: Routes = [
  
  // 사용자관리 페이지
  {
    path: 'sys/users',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
      codeKeys: ['GENDER_00', 'RANK_00', 'JOB_TITLE_00'],
    },
    loadComponent: () => import('./system-user/system-user.component').then(x => x.SystemUserComponent),
  },
  // 권한관리 페이지
  {
    path: 'sys/roles',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
    },
    loadComponent: () => import('./system-role/system-role.component').then(x => x.SystemRoleComponent),
  },
  // 메뉴관리 페이지
  {
    path: 'sys/menus',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
    },
    loadComponent: () => import('./system-menu/system-menu.component').then(x => x.SystemMenuComponent),
  },
  // 코드관리 페이지
  {
    path: 'sys/codes',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
    },
    loadComponent: () => import('./system-code/system-code.component').then(x => x.SystemCodeComponent),
  },
  // 게시판관리 페이지
  {
    path: 'sys/boards',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
      codeKeys: ['BOARD_TYPE_00'],
    },
    loadComponent: () => import('./system-board/system-board.component').then(x => x.SystemBoardComponent),
  },
  // 회사정보관리 페이지
  {
    path: 'sys/companies',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.SYSTEM_ADMIN.id],
      codeKeys: ['APPLY_STATE_00'],
    },
    loadComponent: () => import('./system-company/system-company.component').then(x => x.SystemCompanyComponent),
  },
  
];
