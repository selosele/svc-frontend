import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiButtonComponent, UiContentTitleComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { CompanyStore } from '@app/company/company.store';
import { CompanyService } from '@app/company/company.service';
import { CompanyResponseDTO } from '@app/company/company.model';
import { SystemCompanyDetailComponent } from './system-company-detail/system-company-detail.component';
import { SystemCompanyApplyComponent } from './system-company-apply/system-company-apply.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiSplitterComponent,
    UiTableComponent,
    UiButtonComponent,
    UiContentTitleComponent,
    LayoutPageDescriptionComponent,
    SystemCompanyDetailComponent,
    SystemCompanyApplyComponent,
  ],
  selector: 'view-system-company',
  templateUrl: './system-company.component.html',
  styleUrl: './system-company.component.scss'
})
export class SystemCompanyComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private companyStore: CompanyStore,
    private companyService: CompanyService,
  ) {
    super();
  }

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 회사 목록 */
  get companyList() {
    return this.companyStore.select<CompanyResponseDTO[]>('companyList').value;
  }

  /** 회사 목록 데이터 로드 완료 여부 */
  get companyListDataLoad() {
    return this.companyStore.select<boolean>('companyListDataLoad').value;
  }

  /** 회사 정보 */
  detail: CompanyResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: CompanyResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'corporateName',  header: '법인명' },
    { field: 'companyName',    header: '회사명' },
    { field: 'registrationNo', header: '사업자등록번호' },
    { field: 'companyAddr',    header: '회사 소재지' },
    { field: 'ceoName',        header: '대표자명' },
  ];

  ngOnInit() {
    if (!this.companyListDataLoad && this.user) {
      this.listCompany();
    }
  }

  /** 회사 목록을 조회한다. */
  listCompany(): void {
    this.companyService.listCompany();
  }

  /** 회사를 추가한다. */
  addCompany(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 회사정보목록 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.companyService.getCompany$(event.data['companyId'])
    .subscribe((data) => {
      this.detail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.detail = {};
    this.splitter.hide();
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listCompany();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listCompany();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
