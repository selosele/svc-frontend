import { Routes } from '@angular/router';
import { loginGuard } from '@app/shared/guards';

/** 인증 페이지 라우터 */
export const authRoutes: Routes = [
  
  // 로그인 페이지
  {
    path: 'auth/login',
    canActivate: [loginGuard],
    loadComponent: () => import('./login/login.component').then(x => x.LoginComponent),
  },
];
