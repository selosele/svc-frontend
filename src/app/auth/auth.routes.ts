import { Routes } from '@angular/router';
import { signInGuard } from '@app/shared/guards';

/** 인증 라우터 */
export const authRoutes: Routes = [
  
  // 로그인 페이지
  {
    path: 'auth/sign-in',
    canActivate: [signInGuard],
    loadComponent: () => import('./sign-in/sign-in.component').then(x => x.SignInComponent),
  },
];
