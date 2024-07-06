import { Routes } from '@angular/router';
import { authGuard, menuGuard } from '@app/shared/guards';
import { roles } from '@app/shared/utils';

/** 인사관리 페이지 라우터 */
export const humanRoutes: Routes = [
  
  // 마이페이지
  {
    path: 'human/mypage',
    canActivate: [authGuard, menuGuard],
    data: {
      roles: [roles.employee],
    },
    loadComponent: () => import('./human-mypage/human-mypage.component').then(x => x.HumanMypageComponent),
  },
];
