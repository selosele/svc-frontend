import { Component, OnInit } from '@angular/core';
import { LayoutPageDescriptionComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components';
import { AuthService } from '@app/auth/auth.service';
import { RoleResponseDTO } from '@app/auth/auth.model';

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
    private authService: AuthService,
  ) {}

  /** 권한 목록 */
  get roleList(): RoleResponseDTO[] {
    return this.authService.roleList.value;
  }

  /** 권한 목록 데이터 로드 완료 여부 */
  get roleListDataLoad(): boolean {
    return this.authService.roleListDataLoad.value;
  }

  /** 테이블 선택된 행 */
  selection: RoleResponseDTO;

  /** 테이블 컬럼 목록 */
  cols = [
    { field: 'roleId',    header: '권한 ID'},
    { field: 'roleName',  header: '권한 명'},
    { field: 'roleOrder', header: '권한 순서'},
  ];

  ngOnInit(): void {
    if (!this.roleListDataLoad) {
      this.listRole();
    }
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.authService.listRole();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listRole();
  }

}
