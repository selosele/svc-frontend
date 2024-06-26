import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';
import { roles } from '@app/shared/utils';

/** 일정관리 페이지 라우터 */
export const scheduleRoutes: Routes = [
  
  // 일정관리 페이지
  {
    path: 'schedule',
    canActivate: [authGuard],
    data: {
      roles: [roles.employee],
    },
    loadComponent: () => import('./schedule.component').then(x => x.ScheduleComponent),
  },
];
