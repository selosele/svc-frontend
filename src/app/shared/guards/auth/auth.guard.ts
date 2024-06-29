import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { LOGIN_PAGE_PATH } from '@app/shared/utils';

/** 인증 guard */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLogined()) {
    const userRoles = authService.getAuthenticatedUser().roles;

    if (route.data.roles && !(route.data.roles as string[]).some(x => userRoles.includes(x))) {
      router.navigateByUrl('/');
      return false;
    }

    if (state.url !== LOGIN_PAGE_PATH)
      return true; // 로그인된 상태에서 로그인 페이지가 아닌 다른 페이지에 접근 시 허용
    
    router.navigateByUrl('/');
    return false;
  }

  router.navigateByUrl(LOGIN_PAGE_PATH);
  return false;
};
