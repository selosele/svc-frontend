import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreBaseComponent } from '@app/shared/components/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { PayslipStore } from '@app/payslip/payslip.store';
import { PayslipService } from '@app/payslip/payslip.service';
import { WorkHistoryService } from '@app/work-history/work-history.service';
import { WorkHistoryResponseDTO } from '@app/work-history/work-history.model';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { SalaryPayslipListComponent } from './salary-payslip-list/salary-payslip-list.component';
import { PayslipDataStateDTO } from '@app/payslip/payslip.model';
import { isEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    LayoutPageDescriptionComponent,
    SalaryPayslipListComponent,
    UiSkeletonComponent,
    UiTabComponent
  ],
  selector: 'view-salary-payslip',
  templateUrl: './salary-payslip.component.html',
  styleUrl: './salary-payslip.component.scss'
})
export class SalaryPayslipComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private payslipStore: PayslipStore,
    private payslipService: PayslipService,
    private workHistoryService: WorkHistoryService,
  ) {
    super();
  }

  /** 회사 탭 */
  tabs: Tab[] = [];

  /** 급여명세서 테이블 타이틀 */
  get payslipTableTitle() {
    return this.payslipStore.select<string>('payslipTableTitle').value;
  }

  /** 급여명세서 테이블 텍스트 */
  get payslipTableText() {
    return this.payslipStore.select<string>('payslipTableText').value;
  }

  /** 급여명세서 목록 */
  get payslipList() {
    return this.payslipStore.select<PayslipDataStateDTO>('payslipList');
  }

  /**
   * 선택된 회사 탭의 index
   *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
   */
  get activeIndex() {
    return this.payslipStore.select<number>('payslipWorkHistoryTabIndex').value;
  }

  /** 선택된 회사 탭의 index를 변경한다. */
  set activeIndex(value: number) {
    this.payslipStore.update('payslipWorkHistoryTabIndex', value);
  }

  /** 선택된 회사 탭의 근무이력 ID */
  activeWorkHistoryId: number;

  /** 근무이력 탭 목록 */
  get workHistoryTabList() {
    return this.payslipStore.select<Tab[]>('payslipWorkHistoryTabList').value;
  }

  /** 근무이력 목록 데이터 로드 완료 여부 */
  get workHistoryListDataLoad() {
    const data = this.payslipStore.select<Tab[]>('payslipWorkHistoryTabList').value;
    return data?.find(x => x.key === this.activeWorkHistoryId)?.dataLoad ?? false;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.payslipStore.select<WorkHistoryResponseDTO[]>('payslipWorkHistoryList').value;
  }

  ngOnInit() {
    this.payslipService.setWorkHistoryId(parseInt(`${this.user?.workHistoryId}`));

    this.activeWorkHistoryId = Number(this.user?.workHistoryId);

    if (!this.workHistoryListDataLoad && this.user) {
      this.listWorkHistory();
    }
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.activeWorkHistoryId = Number(event.activeKey);
    this.payslipService.setWorkHistoryId(this.activeWorkHistoryId);
    this.setPayslipTableContent();
  }

  /** 근무이력 목록을 다시 조회한다. */
  onRefresh(): void {
    this.listWorkHistory();
  }

  /** 근무이력 목록을 조회한다. */
  private listWorkHistory(): void {
    this.workHistoryService.listWorkHistory$({
      employeeId: this.user?.employeeId,
    })
    .subscribe((data) => {
      this.payslipStore.update('payslipWorkHistoryList', data);
      this.payslipStore.update('payslipWorkHistoryTabList', data.map(x => ({ title: x.companyName, key: x.workHistoryId, dataLoad: true })));
      this.setPayslipTableContent();
    });
  }

  /** 테이블 문구를 설정한다. */
  private setPayslipTableContent(): void {
    this.payslipList.asObservable().subscribe((data) => {
      if (isEmpty(data)) return;

      const currentPayslip = data[this.activeWorkHistoryId]?.data[0];
      this.payslipService.setPayslipTableContent(this.activeIndex, currentPayslip);
    });
  }

}
