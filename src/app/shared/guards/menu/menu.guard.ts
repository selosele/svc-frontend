import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { MenuService } from '@app/menu/menu.service';
import { isNotEmpty } from '@app/shared/utils';

/** 메뉴 guard */
export const menuGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const menuService = inject(MenuService);

  menuService.menuList$.subscribe((menuList) => {
    if (menuList.length === 0) return;

    /** 현재 메뉴 ID */
    const menuId = parseInt(route.queryParams['menuId']);

    /** 현재 메뉴 URL */
    const menuUrl = `/${route.routeConfig.path}`;

    /** 현재 메뉴명 */
    const menuName = menuList.find(x => x.menuId === menuId)?.menuName;

    // 같은 메뉴접속이력 데이터가 존재하는지 확인한다.
    const hasExist = isNotEmpty(menuService.menuHistoryList.value.find(x => x.menuId === menuId));
    if (hasExist) return;

    // 메뉴접속이력 데이터를 쌓아 넣는다.
    menuService.setMenuHistoryList([...menuService.menuHistoryList.value, { menuId, menuUrl, menuName }]);
  });
  
  return true;
};
