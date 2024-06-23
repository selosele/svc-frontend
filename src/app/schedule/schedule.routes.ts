import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';

/** 일정관리 페이지 라우터 */
export const scheduleRoutes: Routes = [
  
  // 일정관리 페이지
  {
    path: 'schedule',
    canActivate: [authGuard],
    loadComponent: () => import('./schedule.component').then(x => x.ScheduleComponent),
  },
];
