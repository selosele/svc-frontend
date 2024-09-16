import { Component, OnInit, ViewChild } from '@angular/core';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { AuthService } from '@app/auth/auth.service';
import { StoreService } from '@app/shared/services';
import { UserResponseDTO } from '@app/auth/auth.model';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiSkeletonComponent,
    UiTableComponent,
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
    private store: StoreService,
    private authService: AuthService,
  ) {}

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 사용자 목록 */
  get userList(): UserResponseDTO[] {
    return this.store.select<UserResponseDTO[]>('userList').value;
  }

  /** 사용자 목록 데이터 로드 완료 여부 */
  get userListDataLoad() {
    return this.store.select<boolean>('userListDataLoad').value;
  }

  /** 사용자 정보 */
  userDetail: UserResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: UserResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'userAccount',  header: '사용자 계정' },
    { field: 'employeeName', header: '직원명' },
    { field: 'companyName',  header: '회사명' },
    { header: '직위/직책',
      valueGetter: (data) => `${data.rankCodeName}/${data.jobTitleCodeName}`
    },
    { field: 'userActiveYn', header: '사용자 활성화 여부' },
    { field: 'rolesString',  header: '권한' },
  ];

  ngOnInit(): void {
    if (!this.userListDataLoad) {
      this.listUser();
    }
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.authService.listUser();
  }

  /** 사용자를 추가한다. */
  addUser(): void {
    this.userDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.authService.getUser$(event.data['userId'])
    .subscribe((data) => {
      this.userDetail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.userDetail = {};
    this.splitter.hide();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listUser();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listUser();
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
