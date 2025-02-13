import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { filter, firstValueFrom, take } from 'rxjs';
import { MenuStore } from '@app/menu/menu.store';
import { MenuService } from '@app/menu/menu.service';
import { MenuResultDTO } from '@app/menu/menu.model';
import { ERROR_PAGE_PATH, LOGIN_PAGE_PATH, MAIN_PAGE_PATH1, MAIN_PAGE_PATH2 } from '@app/shared/utils';

/** 메뉴 guard */
export const menuGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const menuStore = inject(MenuStore);
  const menuService = inject(MenuService);

  // 메뉴 목록을 조회한다.
  if (!menuStore.select<boolean>('menuListDataLoad').value) {
    menuService.listMenu();
  }
  
  const menuList = await firstValueFrom(
    menuStore.select<MenuResultDTO[]>('menuList').pipe(
      filter((menuList) => Array.isArray(menuList) && menuList.length > 0),
      take(1)
    )
  );

  // 메뉴 목록이 없으면 에러페이지로 이동한다.
  if (!menuList || menuList?.length === 0) {
    await router.navigateByUrl(ERROR_PAGE_PATH);
    return false;
  }

  // menuId 파라미터가 없으면 에러페이지로 이동한다.
  if (isExcludePath(route.routeConfig.path) && !route.queryParams.menuId) {
    await router.navigateByUrl(ERROR_PAGE_PATH);
    return false;
  }

  // 현재 메뉴를 찾는다.
  const currentMenu = menuList.find(menu => menu.menuId === Number(route.queryParams.menuId));

  if (isExcludePath(route.routeConfig.path)) {
    
    // 미사용 or 삭제된 메뉴일 경우 에러페이지로 이동한다.
    if (!currentMenu || currentMenu.useYn === 'N' || currentMenu.deleteYn === 'Y') {
      await router.navigateByUrl(ERROR_PAGE_PATH);
      return false;
    }
  }

  // 메뉴 관련 데이터를 설정한다.
  menuService.setData();
  return true;
};

/** 제외 경로 여부를 반환한다. */
function isExcludePath(path: string): boolean {
  const excludeUrls = [
    MAIN_PAGE_PATH1,
    MAIN_PAGE_PATH2.substring(1),
    LOGIN_PAGE_PATH.substring(1)
  ];
  return !excludeUrls.includes(path);
}
