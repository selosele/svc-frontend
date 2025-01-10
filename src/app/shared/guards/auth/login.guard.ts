import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { MAIN_PAGE_PATH1 } from '@app/shared/utils';

/** 로그인 guard */
export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // 로그인이 되어 있으면 메인 페이지로 이동한다.
  if (authService.isLogined()) {
    router.navigateByUrl(MAIN_PAGE_PATH1);
    return false;
  }
  return true;
};
