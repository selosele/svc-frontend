import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { AuthService } from '@app/auth/auth.service';
import { RoleResponseDTO } from '@app/auth/auth.model';
import { StoreService, UiDialogService } from '@app/shared/services';
import { MenuService } from '@app/menu/menu.service';
import { SystemRoleDetailComponent } from './system-role-detail/system-role-detail.component';

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
export class SystemRoleComponent implements OnInit {

  constructor(
    private store: StoreService,
    private dialogService: UiDialogService,
    private authService: AuthService,
    private menuService: MenuService,
  ) {}

  /** 권한 목록 */
  get roleList(): RoleResponseDTO[] {
    return this.store.select<RoleResponseDTO[]>('roleList').value;
  }

  /** 권한 목록 데이터 로드 완료 여부 */
  get roleListDataLoad() {
    return this.store.select<boolean>('roleListDataLoad').value;
  }

  /** 테이블 선택된 행 */
  selection: RoleResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'roleId',    header: '권한 ID' },
    { field: 'roleName',  header: '권한명' },
    { field: 'roleOrder', header: '권한 순서' },
  ];

  ngOnInit() {
    if (!this.roleListDataLoad) {
      this.listRole();
    }
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.authService.listRole();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    combineLatest([
      this.authService.listUserByRole$({ roleIdList: [event.data['roleId']] }),
      this.menuService.listMenuByRole$({ roleIdList: [event.data['roleId']] })
    ]).subscribe(([userList, menuList]) => {
      const menuTree = this.menuService.createMenuTree(menuList);

      this.dialogService.open(SystemRoleDetailComponent, {
        focusOnShow: false,
        header: `"${event.data['roleName']}" 권한별 사용자 및 메뉴 목록 조회`,
        data: { userList, menuTree },
      });
    });
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listRole();
  }

}
