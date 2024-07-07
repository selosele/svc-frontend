import { Component, OnInit } from '@angular/core';
import { GridApi, CellClickedEvent } from '@ag-grid-community/core';
import { LayoutPageDescriptionComponent, UiButtonComponent, UiDataGridComponent, UiSplitterComponent } from '@app/shared/components';
import { UiSplitterService } from '@app/shared/services';
import { AuthService } from '@app/auth/auth.service';
import { UserResponseDTO } from '@app/auth/auth.dto';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiDataGridComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    SystemUserDetailComponent,
  ],
  selector: 'view-system-user',
  templateUrl: './system-user.component.html',
  styleUrl: './system-user.component.scss'
})
export class SystemUserComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private splitterService: UiSplitterService,
  ) {}

  /** 사용자 목록 */
  get userList() {
    return this.authService.userListSubject.value;
  }

  /** 사용자 상세 정보 */
  userDetail: UserResponseDTO = null;

  gridApi = null;
  columnDefs = [
    { field: 'rowNum' },
    { field: 'userId', headerName: '사용자 ID', width: 100 },
    { field: 'userAccount', headerName: '사용자 계정', flex: 1 },
    { field: 'userName', headerName: '사용자 명', flex: 1 },
    { field: 'userActiveYn', headerName: '사용자 활성화 여부', flex: 1 },
    { field: 'roles', headerName: '권한', flex: 1,
      valueGetter: (params) => params.data.roles.map(x => x.roleName)
    },
  ];

  ngOnInit(): void {
    if (this.userList.length === 0) {
      this.listUser();
    }
  }

  onGridReady(gridApi: GridApi): void {
    this.gridApi = gridApi;
  }

  onCellClicked(event: CellClickedEvent): void {
    this.authService.getUser(event.data['userId'])
    .subscribe((data) => {
      this.userDetail = data;
      this.splitterService.showSplitter();
    });
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.authService.listUser();
  }
  
  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listUser();
  }

}
