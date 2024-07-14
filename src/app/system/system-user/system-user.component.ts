import { Component, OnInit, ViewChild } from '@angular/core';
import { GridApi, CellClickedEvent } from '@ag-grid-community/core';
import { LayoutPageDescriptionComponent, UiButtonComponent, UiDataGridComponent, UiSplitterComponent } from '@app/shared/components';
import { AuthService } from '@app/auth/auth.service';
import { UserResponseDTO } from '@app/auth/auth.dto';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';
import { UiMessageService } from '@app/shared/services';

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
    private messageService: UiMessageService,
  ) {}

  /** grid */
  @ViewChild('grid') grid: UiDataGridComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 사용자 목록 */
  get userList() {
    return this.authService.userListSubject.value;
  }

  /** 사용자 상세 정보 */
  userDetail: UserResponseDTO = null;

  columnDefs = [
    { field: '_checkbox' },
    { field: '_rowNum' },
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
    
  }

  onCellClicked(event: CellClickedEvent): void {
    this.authService.getUser(event.data['userId'])
    .subscribe((data) => {
      this.userDetail = data;
      this.splitter.show();
    });
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.authService.listUser();
  }

  /** 사용자를 추가한다. */
  addUser(): void {
    this.userDetail = null;
    this.splitter.show();
  }

  /** 사용자를 삭제한다. */
  async removeUser(event: Event): Promise<void> {
    const rows = this.grid.getSelectedRows();
    if (rows.length === 0) {
      this.messageService.toastInfo('삭제할 사용자를 체크박스로 선택하세요.');
      return;
    }

    const confirm = await this.messageService.confirm2(event, '선택한 사용자를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.authService.removeUser(rows[0].userId)
    .subscribe(() => {
      this.splitter.hide();
      this.listUser();
    });
  }
  
  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listUser();
  }

}
