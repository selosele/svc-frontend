import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { MenuResponseDTO } from '@app/menu/menu.model';
import { MenuService } from '@app/menu/menu.service';
import { StoreService } from '@app/shared/services';
import { isNotEmpty } from '@app/shared/utils';

/** 메뉴 guard */
export const menuGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(StoreService);
  const menuService = inject(MenuService);
  const menuList$ = store.select<MenuResponseDTO[]>('menuList').asObservable();

  menuList$.subscribe((menuList) => {
    if (menuList.length === 0) return;

    /** 메뉴 관련 데이터를 설정한다. */
    menuService.setData();

    /** 현재 메뉴 ID */
    const menuId = parseInt(route.queryParams['menuId']);

    /** 현재 메뉴 URL */
    const menuUrl = `/${route.routeConfig.path}`;

    /** 현재 메뉴명 */
    const menuName = menuList.find(x => x.menuId === menuId)?.menuName;

    /** 메뉴접속이력 데이터 */
    const menuHistoryList = store.select<MenuResponseDTO[]>('menuHistoryList').value;

    // 같은 메뉴접속이력 데이터가 존재하는지 확인한다.
    const hasExist = isNotEmpty(menuHistoryList.find(x => x.menuId === menuId));
    if (hasExist) return;

    // 메뉴접속이력 데이터를 쌓아 넣는다.
    menuService.setMenuHistoryList([...menuHistoryList, { menuId, menuUrl, menuName }]);
  });
  
  return true;
};
