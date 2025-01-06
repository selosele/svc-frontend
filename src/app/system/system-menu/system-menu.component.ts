import { Component, ViewChild } from '@angular/core';
import { TreeNodeSelectEvent, TreeNodeUnSelectEvent } from 'primeng/tree';
import { UiSkeletonComponent, UiSplitterComponent, UiTreeComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { MenuTree } from '@app/menu/menu.model';
import { StoreService } from '@app/shared/services';
import { SystemMenuDetailComponent } from './system-menu-detail/system-menu-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTreeComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    SystemMenuDetailComponent,
  ],
  selector: 'view-system-menu',
  templateUrl: './system-menu.component.html',
  styleUrl: './system-menu.component.scss'
})
export class SystemMenuComponent {

  constructor(
    private store: StoreService,
  ) {}

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 메뉴 트리 목록 */
  get menuTree(): MenuTree[] {
    return this.store.select<MenuTree[]>('menuTree').value;
  }

  /** 메뉴 목록 데이터 로드 완료 여부 */
  get menuListDataLoad() {
    return this.store.select<boolean>('menuListDataLoad').value;
  }

  data = [{
    key: '0',
    label: 'Documents',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    children: [
      {
        key: '0-0',
        label: 'Work',
        data: 'Work Folder',
        icon: 'pi pi-fw pi-cog',
        children: [
          { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
          { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
        ]
      },
      {
        key: '0-1',
        label: 'Home',
        data: 'Home Folder',
        icon: 'pi pi-fw pi-home',
        children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
      }
    ]
  }];

  /** 메뉴 tree 노드를 선택한다. */
  onNodeSelect(event: TreeNodeSelectEvent): void {
    this.splitter.show();
  }

  /** 메뉴 tree 노드를 선택해제한다. */
  onNodeUnselect(event: TreeNodeUnSelectEvent): void {
    this.splitter.hide();
  }

}
