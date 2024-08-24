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

  /** 직원 회사 ID */
  employeeCompanyId: number;

  /** 직원 회사 목록 데이터 로드 완료 여부 */
  get employeeCompanyListDataLoad(): boolean {
    return this.humanService.employeeCompanyListDataLoad.value;
  }

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();
    this.employeeCompanyId = this.user.companyId;
    this.listEmployeeCompany();
  }

  /** 직원 회사 목록을 조회한다. */
  listEmployeeCompany(): void {
    this.humanService.listEmployeeCompany(this.user.employeeId);
    this.humanService.employeeCompanyList$.subscribe((data) => {
      if (data === null) return;
      
      this.tabs = [
        ...data.map(x => ({ title: x.companyName, key: x.employeeCompanyId }))
      ];
    });
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.employeeCompanyId = event.activeKey;
  }

}
