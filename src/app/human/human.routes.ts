import { Routes } from '@angular/router';
import { roles } from '@app/shared/utils';
import { authGuard, menuGuard } from '@app/shared/guards';

/** 인사관리 페이지 라우터 */
export const humanRoutes: Routes = [

  // 휴가관리 페이지
  {
    path: 'human/vacations',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.EMPLOYEE],
    },
    loadComponent: () => import('./human-vacation/human-vacation.component').then(x => x.HumanVacationComponent),
  },
  
  // 일정관리 페이지
  {
    path: 'human/schedules',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.EMPLOYEE],
    },
    loadComponent: () => import('./human-schedule/human-schedule.component').then(x => x.HumanScheduleComponent),
  },
  
];
