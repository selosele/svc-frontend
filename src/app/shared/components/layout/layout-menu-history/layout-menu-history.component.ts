import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuStore } from '@app/menu/menu.store';
import { MenuService } from '@app/menu/menu.service';
import { MenuResponseDTO } from '../../../../menu/menu.model';
import { UiButtonComponent } from '../../ui';
import { isEmpty, isNotEmpty } from '@app/shared/utils';

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
    private menuStore: MenuStore,
    private menuService: MenuService,
  ) {}
  
  /** 컨텍스트 메뉴 */
  @ViewChild('cm') cm: ContextMenu;

  /** 컨텍스트 메뉴 목록 */
  contextMenus: MenuItem[] = [];

  /** 메뉴 ID */
  menuId: number;

  /** 컨텍스트 메뉴로 선택한 메뉴 ID */
  cmMenuId: number;

  /** 메뉴접속이력 목록 */
  get menuHistoryList() {
    return this.menuStore.select<MenuResponseDTO[]>('menuHistoryList').value;
  }

  /** 메뉴접속이력 로컬스토리지 목록 */
  get menuHistoryStorageList(): MenuResponseDTO[] {
    return JSON.parse(window.localStorage.getItem(this.menuService.MENU_HISTORY_LIST_KEY))
      ?? [];
  }

  ngOnInit() {
    this.contextMenus = [
      { label: '삭제', icon: 'pi pi-trash', command: () => this.onRemove(this.cmMenuId) },
      { label: '전체 삭제', icon: 'pi pi-trash', command: () => this.removeAll() },
    ];

    if (this.menuHistoryStorageList.length > 0) {
      this.menuStore.update('menuHistoryList', this.menuHistoryStorageList);
    }

    combineLatest([
      this.route.queryParams,
      this.menuStore.select<MenuResponseDTO[]>('menuList').asObservable()
    ])
    .subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) return;

      this.menuId = Number(queryParams?.menuId);
      if (isEmpty(this.menuId) || isNaN(this.menuId)) return;

      // 현재 메뉴 URL을 가져온다.
      const menuUrl = menuList.find(x => x.menuId === this.menuId)?.menuUrl;
    
      // 현재 메뉴명을 가져온다.
      const menuName = menuList.find(x => x.menuId === this.menuId)?.menuName;

      // 같은 메뉴접속이력 데이터가 존재하는지 확인한다.
      const hasExist = isNotEmpty(this.menuHistoryStorageList.find(x => x.menuId === this.menuId));
      if (hasExist) return;
  
      // 메뉴접속이력 데이터를 쌓아 넣는다.
      this.menuService.setMenuHistoryList([...this.menuHistoryStorageList, { menuId: this.menuId, menuUrl, menuName }]);
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
    //this.cm.target = event.currentTarget;
    this.cm.show(event);
  }

}
