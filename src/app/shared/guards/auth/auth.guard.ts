import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';

/** 인증 guard */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isSignIned()) {
    if (state.url === '/index')
      return true; // 로그인된 상태에서 /index 경로로 접근하면 허용  
    
    router.navigateByUrl('/');
    return false;
  }

  router.navigateByUrl('/auth/sign-in');
  return false;
};
