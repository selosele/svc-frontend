import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { TableRowSelectEvent } from 'primeng/table';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiDialogService } from '@app/shared/services';
import { RoleStore } from '@app/role/role.store';
import { RoleService } from '@app/role/role.service';
import { UserService } from '@app/user/user.service';
import { SystemRoleDetailComponent } from './system-role-detail/system-role-detail.component';
import { RoleResultDTO } from '@app/role/role.model';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTableComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-system-role',
  templateUrl: './system-role.component.html',
  styleUrl: './system-role.component.scss'
})
export class SystemRoleComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private roleStore: RoleStore,
    private dialogService: UiDialogService,
    private userService: UserService,
    private roleService: RoleService,
  ) {
    super();
  }

  /** 권한 목록 */
  get roleList(): RoleResultDTO[] {
    return this.roleStore.select<RoleResultDTO[]>('roleList').value;
  }

  /** 권한 목록 데이터 로드 완료 여부 */
  get roleListDataLoad() {
    return this.roleStore.select<boolean>('roleListDataLoad').value;
  }

  /** 테이블 선택된 행 */
  selection: RoleResultDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'roleId',    header: '권한 ID' },
    { field: 'roleName',  header: '권한명' },
    { field: 'roleOrder', header: '권한 순서' },
  ];

  ngOnInit() {
    if (!this.roleListDataLoad && this.user) {
      this.listRole();
    }
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.roleService.listRole();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: TableRowSelectEvent): void {
    combineLatest([
      this.userService.listUserByRole$({ roleIdList: [event.data['roleId']] }),
      this.menuService.listMenuByRole$({ roleIdList: [event.data['roleId']] })
    ]).subscribe(([userResponse, menuResponse]) => {
      const menuTree = this.menuService.createMenuTree(menuResponse.menuList);

      this.dialogService.open(SystemRoleDetailComponent, {
        focusOnShow: false,
        header: `"${event.data['roleName']}" 권한별 사용자 및 메뉴 목록 조회`,
        data: { userList: userResponse, menuTree },
      });
    });
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listRole();
  }

}
