import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { UiButtonComponent } from '../../ui';
import { MenuStore } from '@app/menu/menu.store';
import { MenuService } from '@app/menu/menu.service';
import { MenuBookmarkResultDTO } from '@app/menu/menu.model';
import { isEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContextMenuModule,
    UiButtonComponent,
  ],
  selector: 'layout-menu-bookmark',
  templateUrl: './layout-menu-bookmark.component.html',
  styleUrl: './layout-menu-bookmark.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuBookmarkComponent implements OnInit {

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

  /** 메뉴 즐겨찾기 ID */
  menuBookmarkId: number;

  /** 컨텍스트 메뉴로 선택한 메뉴 ID */
  cmMenuBookmarkId: number;

  /** 메뉴 즐겨찾기 목록 */
  get menuBookmarkList() {
    return this.menuStore.select<MenuBookmarkResultDTO[]>('menuBookmarkList').value;
  }

  /** 메뉴 즐겨찾기 목록 데이터 로드 완료 여부 */
  get menuBookmarkListDataLoad() {
    return this.menuStore.select<boolean>('menuBookmarkListDataLoad').value;
  }

  ngOnInit() {
    this.contextMenus = [
      { label: '삭제', icon: 'pi pi-trash', command: () => this.onRemove(this.cmMenuBookmarkId) },
      { label: '전체 삭제', icon: 'pi pi-trash', command: () => this.removeAll() },
    ];

    this.route.queryParams.subscribe((queryParams) => {
      this.menuId = Number(queryParams?.menuId);
      if (isEmpty(this.menuId) || isNaN(this.menuId)) return;

      if (!this.menuBookmarkListDataLoad) {
        this.menuService.listMenuBookmark();
      }
    });
  }

  /** 삭제 버튼을 클릭해서 메뉴 즐겨찾기를 삭제한다. */
  onRemove(menuBookmarkId: number): void {
    this.menuService.removeMenuBookmark$(menuBookmarkId)
    .subscribe(() => {

      this.menuService.listMenu$()
      .subscribe((response) => {
        this.menuService.setMenuList(response);
        this.menuStore.update('hasBookmark', false);
        this.menuStore.update('menuBookmarkList', this.menuBookmarkList.filter(x => x.menuBookmarkId !== menuBookmarkId));
      });
    });
  }

  /** 모든 메뉴 즐겨찾기를 삭제한다. */
  removeAll(): void {
    this.menuService.removeMenuBookmarkAll$()
    .subscribe(() => {

      this.menuService.listMenu$()
      .subscribe((response) => {
        this.menuService.setMenuList(response);
        this.menuStore.update('hasBookmark', false);
        this.menuStore.update('menuBookmarkList', []);
      });
    });
  }

  /** 마우스 오른쪽을 클릭한다. */
  onContextMenu(event: any, menuBookmarkId: number): void {
    this.cmMenuBookmarkId = menuBookmarkId;
    //this.cm.target = event.currentTarget;
    this.cm.show(event);
  }

}
