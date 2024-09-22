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

  router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      menuList$.subscribe((menuList) => {
        if (menuList.length === 0) return;
    
        // 메뉴 관련 데이터를 설정한다.
        menuService.setData();
      });
    });
  
  return true;
};
