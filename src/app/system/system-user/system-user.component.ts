import { Component, OnInit, ViewChild } from '@angular/core';
import { TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UserService } from '@app/user/user.service';
import { UserStore } from '@app/user/user.store';
import { UserResultDTO } from '@app/user/user.model';
import { SystemUserDetailComponent } from './system-user-detail/system-user-detail.component';
import { isBlank } from '@app/shared/utils';

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
export class SystemUserComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private userStore: UserStore,
    private userService: UserService,
  ) {
    super();
  }

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 사용자 목록 */
  get userList(): UserResultDTO[] {
    return this.userStore.select<UserResultDTO[]>('userList').value;
  }

  /** 사용자 목록 데이터 로드 완료 여부 */
  get userListDataLoad() {
    return this.userStore.select<boolean>('userListDataLoad').value;
  }

  /** 사용자 정보 */
  detail: UserResultDTO = null;

  /** 테이블 선택된 행 */
  selection: UserResultDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'userAccount',  header: '사용자 계정' },
    { field: 'employeeName', header: '직원명' },
    { field: 'companyName',  header: '회사명' },
    { header: '직위/직책',
      valueGetter: (data) => {
        if (data.jobTitleCode === 'ETC') {
          return data.rankCodeName;
        }

        if (isBlank(data.rankCodeName) && isBlank(data.jobTitleCodeName)) {
          return '';
        }
        
        return `${data.rankCodeName}/${data.jobTitleCodeName}`;
      }
    },
    { field: 'userActiveYn', header: '사용자 활성화 여부' },
    { field: 'rolesString',  header: '권한' },
  ];

  ngOnInit() {
    if (!this.userListDataLoad && this.user) {
      this.listUser();
    }
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.userService.listUser();
  }

  /** 사용자를 추가한다. */
  addUser(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: TableRowSelectEvent): void {
    this.userService.getUser$(event.data['userId'])
    .subscribe((response) => {
      this.detail = response.user;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: TableRowUnSelectEvent): void {
    this.detail = {};
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
