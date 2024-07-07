import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { MenuService, UiSplitterService } from '@app/shared/services';
import { isNotEmpty } from '@app/shared/utils';

/** 메뉴 guard */
export const menuGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const menuService = inject(MenuService);
  const splitterService = inject(UiSplitterService);

  menuService.menuList$.subscribe((menuList) => {
    if (menuList.length === 0) return;

    // Splitter를 비활성화한다.
    splitterService.hideSplitter();

    /** 현재 메뉴 ID */
    const menuId = parseInt(route.queryParams['menuId']);

    /** 현재 메뉴 URL */
    const menuUrl = `/${route.routeConfig.path}`;

    /** 현재 메뉴 명 */
    const menuName = menuList.find(x => x.menuId === menuId)?.menuName;

    // 같은 메뉴접속이력 데이터가 존재하는지 확인한다.
    const hasExist = isNotEmpty(menuService.menuHistoryListSubject.value.find(x => x.menuId === menuId));
    if (hasExist) return;

    // 메뉴접속이력 데이터를 쌓아 넣는다.
    menuService.setMenuHistoryList([...menuService.menuHistoryListSubject.value, { menuId, menuUrl, menuName }]);
  });
  
  return true;
};
