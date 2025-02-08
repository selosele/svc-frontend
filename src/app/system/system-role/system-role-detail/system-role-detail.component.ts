import { Component } from '@angular/core';
import { UserResultDTO } from '@app/user/user.model';
import { MenuTree } from '@app/menu/menu.model';
import { UiTableComponent, UiTreeTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  imports: [
    LayoutPageDescriptionComponent,
    UiTableComponent,
    UiTreeTableComponent,
  ],
  selector: 'modal-system-role-detail',
  templateUrl: './system-role-detail.component.html',
  styleUrl: './system-role-detail.component.scss'
})
export class SystemRoleDetailComponent {

  constructor(
    private config: DynamicDialogConfig,
  ) {}

  /** 사용자 목록 */
  get userList(): UserResultDTO[] {
    return this.config.data['userList'];
  }

  /** 메뉴 트리 목록 */
  get menuTree(): MenuTree[] {
    return this.config.data['menuTree'];
  }

  /** 사용자 목록 테이블 컬럼 */
  userListcols = [
    { field: 'userId',        header: '사용자 ID' },
    { field: 'userAccount',   header: '사용자 계정' },
    { field: 'employeeName',  header: '직원명' },
    { field: 'companyName',   header: '회사명' },
    { field: 'userActiveYn',  header: '사용자 활성화 여부' },
    { field: 'rolesString',   header: '권한' },
  ];

  /** 메뉴 트리 목록 테이블 컬럼 */
  menuTreecols = [
    { field: 'menuId',        header: '메뉴 ID' },
    { field: 'menuName',      header: '메뉴명' },
    { field: 'menuUrl',       header: '메뉴 URL' },
    { field: 'menuDepth',     header: '메뉴 뎁스' },
    { field: 'useYn',         header: '사용여부' },
  ];

}
