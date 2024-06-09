import { Routes } from '@angular/router';
import { authGuard } from '@app/shared/guards';
import { IndexComponent } from './index.component';

/** 메인 라우터 */
export const indexRoutes: Routes = [
  
  // 메인 페이지
  {
    path: 'index',
    canActivate: [authGuard],
    component: IndexComponent,
  },
];
