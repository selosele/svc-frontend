import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  
  // 로그인 페이지
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in.component').then(x => x.SignInComponent),
  },
];
