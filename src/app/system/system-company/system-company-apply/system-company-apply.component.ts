import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { CoreBaseComponent } from '@app/shared/components/core';
import { CompanyApplyResultDTO } from '@app/company/company.model';
import { UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { CompanyStore } from '@app/company/company.store';
import { CompanyService } from '@app/company/company.service';
import { SystemCompanyApplyDetailComponent } from './system-company-apply-detail/system-company-apply-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiSplitterComponent,
    UiTableComponent,
    LayoutPageDescriptionComponent,
    SystemCompanyApplyDetailComponent,
  ],
  selector: 'view-system-company-apply',
  templateUrl: './system-company-apply.component.html',
  styleUrl: './system-company-apply.component.scss'
})
export class SystemCompanyApplyComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private companyStore: CompanyStore,
    private companyService: CompanyService,
  ) {
    super();
  }

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 회사등록신청 목록 */
  get companyApplyList() {
    return this.companyStore.select<CompanyApplyResultDTO[]>('companyApplyList').value;
  }

  /** 회사등록신청 목록 데이터 로드 완료 여부 */
  get companyApplyListDataLoad() {
    return this.companyStore.select<boolean>('companyApplyListDataLoad').value;
  }

  /** 테이블 컬럼 */
  cols = [
    { field: 'companyName',        header: '회사명' },
    { field: 'corporateName',      header: '법인명' },
    { field: 'registrationNo',     header: '사업자등록번호' },
    { field: 'applyDt',            header: '신청일시' },
    { field: 'applicantName',      header: '신청자명' },
    { field: 'applyStateCodeName', header: '신청상태',
      valueGetter: (data: CompanyApplyResultDTO) => {
        const colorClass = this.getColorClass(data.applyStateCode);
        return `<span class="px-3 py-1 ${colorClass}">${data.applyStateCodeName}</span>`;
      }
    },
  ];

  /** 회사등록신청 정보 */
  detail: CompanyApplyResultDTO = null;

  /** 테이블 선택된 행 */
  selection: CompanyApplyResultDTO;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  ngOnInit() {
    if (!this.companyApplyListDataLoad && this.user) {
      this.listCompanyApply();
    }
  }

  /** 회사등록신청현황 목록을 조회한다. */
  listCompanyApply(): void {
    this.companyService.listCompanyApply();
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listCompanyApply();
  }

  /** 회사등록신청현황 목록을 재조회한다. */
  onRefresh2(): void {
    this.listCompanyApply();
    this.refresh.emit();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: TableRowSelectEvent): void {
    this.companyService.getCompanyApply$(event.data['companyApplyId'])
    .subscribe((response) => {
      this.detail = response.companyApply;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: TableRowUnSelectEvent): void {
    this.detail = {};
    this.splitter.hide();
  }

  /** 테이블 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listCompanyApply();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

  /** 신청상태 color 클래스명을 반환한다. */
  private getColorClass(applyStateCode: string): string {

    // 신청
    if (applyStateCode === 'NEW') {
      return 'bg-primary-reverse';
    }
    // 승인
    else if (applyStateCode === 'APPROVAL') {
      return 'bg-primary text-white';
    }
    // 반려
    else if (applyStateCode === 'REJECT') {
      return 'bg-red-500 text-white';
    }

    return '';
  }

}
