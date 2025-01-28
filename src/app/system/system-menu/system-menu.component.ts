import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNodeSelectEvent, TreeNodeUnSelectEvent } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTreeComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { SystemMenuDetailComponent } from './system-menu-detail/system-menu-detail.component';
import { MenuResponseDTO } from '@app/menu/menu.model';
import { MenuStore } from '@app/menu/menu.store';
import { MenuService } from '@app/menu/menu.service';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTreeComponent,
    UiSplitterComponent,
    UiButtonComponent,
    LayoutPageDescriptionComponent,
    SystemMenuDetailComponent,
  ],
  selector: 'view-system-menu',
  templateUrl: './system-menu.component.html',
  styleUrl: './system-menu.component.scss'
})
export class SystemMenuComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private menuStore: MenuStore,
    private menuService: MenuService,
  ) {
    super();
  }

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 시스템관리 > 메뉴관리 > 메뉴 트리 목록 */
  get sysMenuTree() {
    return this.menuStore.select<TreeNode[]>('sysMenuTree').value;
  }

  /** 시스템관리 > 메뉴관리 > 메뉴 목록 데이터 로드 완료 여부 */
  get sysMenuListDataLoad() {
    return this.menuStore.select<boolean>('sysMenuListDataLoad').value;
  }

  /** 메뉴 트리 */
  data: TreeNode[] = [];

  /** 메뉴 정보 */
  detail: MenuResponseDTO = null;

  ngOnInit() {
    if (!this.sysMenuListDataLoad && this.user) {
      this.listMenu();
    }
  }

  /** 메뉴 목록을 조회한다. */
  listMenu(): void {
    this.menuService.listSysMenu$()
    .subscribe((data) => {
      this.menuService.listMenu(); // 메뉴입력시마다 GNB 메뉴를 새로고침해야 함
      this.menuStore.update('sysMenuListDataLoad', true);
      this.menuStore.update('sysMenuTree', this.menuService.createSysMenuTree(data));
    });
  }

  /** 메뉴 tree 노드를 선택한다. */
  onNodeSelect(event: TreeNodeSelectEvent): void {
    this.menuService.getMenu$(+event.node.key)
    .subscribe((data) => {
      this.detail = data;
      this.splitter.show();
    });
  }

  /** 메뉴 tree 노드를 선택해제한다. */
  onNodeUnselect(event: TreeNodeUnSelectEvent): void {
    this.detail = {};
    this.splitter.hide();
  }

  /** 메뉴를 추가한다. */
  addMenu(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listMenu();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
