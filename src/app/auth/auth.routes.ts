import { Routes } from '@angular/router';

/** 인증 라우터 */
export const authRoutes: Routes = [
  
  // 로그인 페이지
  {
    path: 'auth/sign-in',
    loadComponent: () => import('./sign-in/sign-in.component').then(x => x.SignInComponent),
  },
];
