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

  /** 직원 회사 탭 목록 */
  get employeeCompanyTabList() {
    return this.humanService.employeeCompanyTabList.value;
  }

  /** 직원 회사 목록 데이터 로드 완료 여부 */
  get employeeCompanyListDataLoad(): boolean {
    return this.humanService.employeeCompanyListDataLoad.value;
  }

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();
    this.humanService.setEmployeeCompanyId(parseInt(`${this.user.employeeCompanyId}`));

    if (!this.employeeCompanyListDataLoad) {
      this.listEmployeeCompany();
    }
  }

  /** 직원 회사 목록을 조회한다. */
  listEmployeeCompany(): void {
    this.humanService.listEmployeeCompany(this.user.employeeId);
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.humanService.setEmployeeCompanyId(event.activeKey);
  }

}
