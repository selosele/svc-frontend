import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreBaseComponent } from '../../core';
import { LayoutMobileMenuStore } from './layout-mobile-menu.store';
import { MenuStore } from '@app/menu/menu.store';
import { MenuTree } from '@app/menu/menu.model';
import { UiButtonComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiButtonComponent,
  ],
  selector: 'layout-mobile-menu',
  templateUrl: './layout-mobile-menu.component.html',
  styleUrl: './layout-mobile-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMobileMenuComponent extends CoreBaseComponent {

  constructor(
    private layoutMobileMenuStore: LayoutMobileMenuStore,
    private menuStore: MenuStore,
  ) {
    super();
  }

  /** 메뉴 트리 목록 */
  menuTree$? = this.menuStore.select<MenuTree[]>('menuTree').asObservable();

  /** 현재 메뉴 ID */
  currentMenuId$? = this.menuStore.select<number>('currentMenuId').asObservable();

  /** 현재 상위 메뉴 ID */
  currentUpMenuId$? = this.menuStore.select<number>('currentUpMenuId').asObservable();

  /** 클릭해서 활성화된 메뉴 ID */
  activeMenuId?: number;

  /** 모바일 메뉴 표출 여부 */
  get isVisible() {
    return this.layoutMobileMenuStore.select<boolean>('isVisible').value;
  }

  set isVisible(value: boolean) {
    this.layoutMobileMenuStore.update('isVisible', value);
  }

  /** 1뎁스 메뉴를 클릭해서 펼치고 접는다. */
  toggleSubMenu(event: Event, menuId: number, type = 'ONLY_DEPTH1'): void {
    event.preventDefault();

    if (type === 'ONLY_DEPTH1') {
      this.isVisible = false;
      this.activeMenuId = menuId;
    }
    else if (type === 'HAS_CHILDREN') {
      this.activeMenuId = menuId;
    }
  }

  /** 메뉴 링크를 클릭한다. */
  onClick(event: Event): void {
    event.preventDefault();
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.isVisible = false;
    this.authService.logout();
  }

}
