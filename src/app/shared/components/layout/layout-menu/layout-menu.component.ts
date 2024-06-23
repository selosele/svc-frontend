import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuService } from '@app/shared/services';
import { AuthService } from '@app/auth/auth.service';
import { UiLinkComponent } from '../../ui';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiLinkComponent,
  ],
  selector: 'layout-menu',
  templateUrl: './layout-menu.component.html',
  styleUrl: './layout-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuComponent implements OnInit {

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router,
  ) {
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.activeMenuUrl = val.url;
      }
    });
  }

  /** 메뉴 목록 */
  menuList$ = this.menuService.menuList$;

  /** 마우스를 올려서 활성화된 메뉴 ID */
  activeMenuId?: number;

  /** 현재 메뉴 URL */
  activeMenuUrl?: string;

  ngOnInit(): void {
    this.menuList$.subscribe((menuList) => {
      if (menuList.length === 0 && this.authService.isLogined()) {
        this.listMenu();
      }
    });
  }

  /** 메뉴 목록을 조회한다. */
  listMenu(): void {
    this.menuService.listMenu();
  }

  /** 1뎁스 메뉴에 마우스를 올려서 펼치고 접는다. */
  toggleSubMenu(menuId: number, isMouseEnter: boolean): void {
    this.activeMenuId = isMouseEnter ? menuId : null;
  }

}
