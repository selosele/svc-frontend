import { Routes } from '@angular/router';
import { roles } from '@app/shared/utils';
import { authGuard, menuGuard } from '@app/shared/guards';
import { codeResolver } from '@app/shared/resolvers';

/** 인사관리 페이지 라우터 */
export const humanRoutes: Routes = [

  // 마이페이지
  {
    path: 'hm/my-info',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.EMPLOYEE],
      codeKeys: ['GENDER_00', 'RANK_00', 'JOB_TITLE_00', 'ANNUAL_TYPE_00'],
    },
    loadComponent: () => import('./human-my-info/human-my-info.component').then(x => x.HumanMyInfoComponent),
  },
  // 휴가관리 페이지
  {
    path: 'hm/vacations',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.EMPLOYEE],
      codeKeys: ['VACATION_TYPE_00', 'ANNUAL_TYPE_00'],
    },
    loadComponent: () => import('./human-vacation/human-vacation.component').then(x => x.HumanVacationComponent),
  },
  
];
