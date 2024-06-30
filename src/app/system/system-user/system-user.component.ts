import { Component, OnInit } from '@angular/core';
import { GridApi } from '@ag-grid-community/core';
import { AuthService } from '@app/auth/auth.service';
import { LayoutPageDescriptionComponent, UiButtonComponent, UiDataGridComponent } from '@app/shared/components';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiDataGridComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-system-user',
  templateUrl: './system-user.component.html',
  styleUrl: './system-user.component.scss'
})
export class SystemUserComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) {}

  get userList() {
    return this.authService.userListSubject.value;
  }

  gridApi = null;
  columnDefs = [
    { field: 'rowNum' },
    { field: 'userId', headerName: '사용자 ID' },
    { field: 'userAccount', headerName: '사용자 계정', flex: 1 },
    { field: 'userName', headerName: '사용자 명', flex: 1 },
    { field: 'userActiveYn', headerName: '사용자 활성화 여부', flex: 1,
      valueGetter: (params) => this.getUserActiveYnName(params.data.userActiveYn)
    },
    { field: 'roles', headerName: '권한', flex: 1,
      valueGetter: (params) => params.data.roles.map(x => x.roleName)
    },
  ];

  ngOnInit(): void {
    this.listUser();
  }

  onGridReady(params: GridApi): void {
    this.gridApi = params;
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    if (this.userList.length === 0) {
      this.authService.listUser();
    }
  }
  
  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.authService.listUser();
  }

  /** 사용자 활성화 여부 값을 커스터마이징해서 반환한다. */
  getUserActiveYnName(value: string): string {
    switch (value) {
      case 'Y': return '활성화';
      case 'N': return '비활성화';
      default : return '알수없음';
    }
  }

}
