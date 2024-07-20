import { Routes } from '@angular/router';
import { authGuard, menuGuard } from '@app/shared/guards';
import { roles } from '@app/shared/utils';

/** 일정관리 페이지 라우터 */
export const scheduleRoutes: Routes = [
  
  // 일정관리 페이지
  {
    path: 'schedules',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.EMPLOYEE],
    },
    loadComponent: () => import('./schedule.component').then(x => x.ScheduleComponent),
  },
];
