import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { Tab, UiTabChangeEvent } from '@app/shared/models';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { HumanService } from '../human.service';
import { HumanVacationListComponent } from './human-vacation-list/human-vacation-list.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiSkeletonComponent,
    UiTabComponent,
    LayoutPageDescriptionComponent,
    HumanVacationListComponent,
  ],
  selector: 'view-human-vacation',
  templateUrl: './human-vacation.component.html',
  styleUrl: './human-vacation.component.scss'
})
export class HumanVacationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private humanService: HumanService,
  ) {}

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 회사 탭 */
  tabs: Tab[] = [];

  /** 선택된 회사 탭 index */
  activeIndex: number;

  /** 휴가 테이블 타이틀 */
  get vacationTableTitle() {
    return this.humanService.vacationTableTitle.value;
  }

  /** 근무이력 탭 목록 */
  get workHistoryTabList() {
    return this.humanService.workHistoryTabList.value;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.humanService.workHistoryList.value;
  }

  /** 근무이력 목록 데이터 로드 완료 여부 */
  get workHistoryListDataLoad(): boolean {
    return this.humanService.workHistoryListDataLoad.value;
  }

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();
    this.humanService.setWorkHistoryId(parseInt(`${this.user.workHistoryId}`));

    if (!this.workHistoryListDataLoad) {
      this.listWorkHistory();
    }
  }

  /** 근무이력 목록을 조회한다. */
  listWorkHistory(): void {
    this.humanService.listWorkHistory(this.user.employeeId);
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.humanService.setWorkHistoryId(event.activeKey);
    this.humanService.setVacationTableTitle(this.activeIndex);
  }

}
