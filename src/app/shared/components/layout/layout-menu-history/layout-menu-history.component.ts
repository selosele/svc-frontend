import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuResponseDTO } from '../../../../menu/menu.model';
import { UiButtonComponent } from '../../ui';
import { MenuService } from '@app/menu/menu.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContextMenuModule,
    UiButtonComponent,
  ],
  selector: 'layout-menu-history',
  templateUrl: './layout-menu-history.component.html',
  styleUrl: './layout-menu-history.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuHistoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}
  
  /** 컨텍스트 메뉴 */
  @ViewChild('cm') cm: ContextMenu;

  /** 컨텍스트 메뉴 목록 */
  contextMenus: MenuItem[] = [];

  /** 메뉴접속이력 목록 */
  get menuHistoryList() {
    return this.menuService.menuHistoryList.value;
  }

  /** 메뉴 ID */
  menuId: number;

  /** 컨텍스트 메뉴로 선택한 메뉴 ID */
  cmMenuId: number;

  ngOnInit(): void {
    this.contextMenus = [
      { label: '삭제', icon: 'pi pi-trash', command: () => this.onRemove(this.cmMenuId) },
      { label: '전체 삭제', icon: 'pi pi-trash', command: () => this.removeAll() },
    ];

    this.route.queryParams.subscribe((params) => {
      this.menuId = Number(params?.menuId);

      const menuHistoryList = JSON.parse(window.localStorage.getItem(this.menuService.MENU_HISTORY_LIST_KEY))
        ?? [];

      this.menuService.setMenuHistoryList(menuHistoryList as MenuResponseDTO[]);
    });
  }

  /** 삭제 버튼을 클릭해서 메뉴접속이력을 삭제한다. */
  onRemove(menuId: number): void {
    this.menuService.setMenuHistoryList(this.menuHistoryList.filter(x => x.menuId !== menuId));
  }

  /** 모든 메뉴접속이력을 삭제한다. */
  removeAll(): void {
    this.menuService.setMenuHistoryList([]);
  }

  /** 마우스 오른쪽을 클릭한다. */
  onContextMenu(event: any, menuId: number): void {
    this.cmMenuId = menuId;
    this.cm.target = event.currentTarget;
    this.cm.show(event);
  }

}
