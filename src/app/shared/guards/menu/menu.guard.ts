import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { filter } from 'rxjs';
import { MenuResponseDTO } from '@app/menu/menu.model';
import { MenuService } from '@app/menu/menu.service';
import { StoreService } from '@app/shared/services';

/** 메뉴 guard */
export const menuGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const store = inject(StoreService);
  const menuService = inject(MenuService);
  const menuList$ = store.select<MenuResponseDTO[]>('menuList').asObservable();

  // menuId 파라미터가 없으면 에러페이지로 이동한다.
  if (!route.queryParams.menuId) {
    router.navigateByUrl('/error');
    return false;
  }

  router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      menuList$.subscribe((menuList) => {
        if (menuList.length === 0) return;

        const currentMenu = menuList.find(menu => menu.menuId === Number(route.queryParams.menuId));

        // 메뉴가 없거나 미사용 or 삭제된 메뉴일경우 에러페이지로 이동한다.
        if (!currentMenu || currentMenu.useYn === 'N' || currentMenu.deleteYn === 'Y') {
          router.navigateByUrl('/error');
          return;
        }
    
        // 메뉴 관련 데이터를 설정한다.
        menuService.setData();
      });
    });
  
  return true;
};
