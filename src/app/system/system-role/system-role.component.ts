import { Component, OnInit } from '@angular/core';
import { GridApi } from '@ag-grid-community/core';
import { LayoutPageDescriptionComponent, UiDataGridComponent } from '@app/shared/components';
import { AuthService } from '@app/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    UiDataGridComponent,
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
  get roleList() {
    return this.authService.roleListSubject.value;
  }

  gridApi = null;
  columnDefs = [
    { field: 'rowNum' },
    { field: 'roleId', headerName: '권한 ID', flex: 1 },
    { field: 'roleName', headerName: '권한 명', flex: 1 },
    { field: 'roleOrder', headerName: '권한 순서', flex: 1 },
  ];

  ngOnInit(): void {
    if (this.roleList.length === 0) {
      this.listRole();
    }
  }

  onGridReady(params: GridApi): void {
    this.gridApi = params;
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.authService.listRole();
  }
  
  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listRole();
  }

}
