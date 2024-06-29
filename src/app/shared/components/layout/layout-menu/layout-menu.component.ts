import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '@app/shared/services';
import { UiLinkComponent, UiRouterLinkComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiRouterLinkComponent,
    UiLinkComponent,
  ],
  selector: 'layout-menu',
  templateUrl: './layout-menu.component.html',
  styleUrl: './layout-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuComponent {

  constructor(
    private menuService: MenuService,
  ) {}

  /** 메뉴 트리 목록 */
  menuTree$? = this.menuService.menuTree$;

  /** 현재 메뉴 ID */
  currentMenuId$? = this.menuService.currentMenuId$;

  /** 현재 상위 메뉴 ID */
  currentUpMenuId$? = this.menuService.currentUpMenuId$;

  /** 마우스를 올려서 활성화된 메뉴 ID */
  activeMenuId?: number;

  /** 1뎁스 메뉴에 마우스를 올려서 펼치고 접는다. */
  toggleSubMenu(menuId: number, isMouseEnter: boolean): void {
    this.activeMenuId = isMouseEnter ? menuId : null;
  }

  /** 메뉴 링크를 클릭한다. */
  onClick(event: Event) {
    event.preventDefault();
  }

}
