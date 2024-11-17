import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { StoreService, UiMessageService } from '@app/shared/services';
import { HumanService } from '@app/human/human.service';
import { CompanyOpenAPIResponseDTO, CompanyResponseDTO, GetCompanyRequestDTO } from '@app/human/human.model';
import { groupBy } from '@app/shared/utils';
import { LayoutPageDescriptionComponent } from '../../../layout';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '../../../ui';
import { FormValidator } from '../../form-validator/form-validator.component';
import { UiFormComponent } from '../../ui-form/ui-form.component';
import { UiAutocompleteFieldComponent } from '../../ui-autocomplete-field/ui-autocomplete-field.component';
import { UiTextFieldComponent } from '../../ui-text-field/ui-text-field.component';
import { SearchCompanyDetailComponent } from './search-company-detail/search-company-detail.component';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
    UiAutocompleteFieldComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    UiTableComponent,
    UiSkeletonComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    SearchCompanyDetailComponent,
  ],
  selector: 'modal-search-company',
  templateUrl: './modal-search-company.component.html',
  styleUrl: './modal-search-company.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalSearchCompanyComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private humanService: HumanService,
  ) {}

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 회사 목록 */
  get companyList(): CompanyResponseDTO[] {
    return this.store.select<CompanyResponseDTO[]>('companyList').value;
  }

  /** 회사 목록 데이터 로드 완료 여부 */
  get companyListDataLoad() {
    return this.store.select<boolean>('companyListDataLoad').value;
  }

  /** 회사 목록 데이터 로드 완료 여부 값을 설정한다. */
  set companyListDataLoad(value: boolean) {
    this.store.update('companyListDataLoad', value);
  }

  /** 회사 정보 */
  detail: CompanyResponseDTO = null;

  /** 회사 검색 폼 */
  searchForm: FormGroup;

  /** Open API로 조회한 회사 목록 */
  companyOpenAPIList = [];

  /** 테이블 컬럼 */
  cols = [
    { field: 'corporateName',  header: '법인명' },
    { field: 'companyName',    header: '회사명' },
    { field: 'registrationNo', header: '사업자등록번호' },
    { field: 'companyAddr',    header: '회사 소재지' },
    { field: 'ceoName',        header: '대표자명' },
  ];

  ngOnInit() {
    if (!this.companyListDataLoad) {
      this.listCompany();
    }

    this.searchForm = this.fb.group({
      companyName: ['', [FormValidator.maxLength(100)]],  // 회사명
      registrationNo: ['', [FormValidator.maxLength(10)]] // 사업자등록번호
    });

    this.dialogRef.onClose.subscribe(() => {
      this.companyListDataLoad = false; // 모달을 닫고 다시 열면 리스트를 처음부터 다시 조회하도록 해준다.
    });
  }

  /** 회사 목록을 조회한다. */
  listCompany(): void {
    this.humanService.listCompany();
  }

  /** 회사를 검색한다. */
  onSubmit(value: GetCompanyRequestDTO): void {
    this.companyListDataLoad = false;
    this.humanService.listCompany(value);
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listCompany();
  }

  /** 테이블 행을 더블 클릭한다. */
  onRowDblClick(rowData: CompanyResponseDTO): void {
    this.dialogRef.close(rowData);
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

  /** 회사명을 입력한다(자동완성). */
  onCompanyNameChange(event: AutoCompleteCompleteEvent): void {
    event.originalEvent.stopPropagation();
    
    this.humanService.listCompanyOpenAPI$({
      corporateName: event.query,
      companyName: event.query,
    })
    .subscribe((data) => {
      const filtered = [];
      const groupByData = groupBy<CompanyOpenAPIResponseDTO>(data, 'bzno'); // bzno(사업자등록번호)를 기준으로 중복 제거

      for (const company of groupByData) {
        if (this.hasCompanyNameValue(company.corpNm, event.query) || this.hasCompanyNameValue(company.enpPbanCmpyNm, event.query)) {
          filtered.push({
            companyName: company.enpPbanCmpyNm || company.corpNm,
            corporateName: company.corpNm,
            registrationNo: company.bzno,
            enpBsadr: company.enpBsadr,
            enpTlno: company.enpTlno,
            enpRprFnm: company.enpRprFnm,
          });
        }
      }

      this.companyOpenAPIList = filtered;
    });
  }

  /** 회사명을 입력한다(keyup). */
  onCompanyNameKeyup(event: KeyboardEvent): void {
    if (event.key != 'Enter') return;

    this.companyListDataLoad = false;
    this.humanService.listCompany(this.searchForm.value as GetCompanyRequestDTO);
  }

  /** 회사 드롭다운 항목을 선택한다. */
  async onCompanyNameSelect(event: AutoCompleteSelectEvent): Promise<void> {
    if (!event.value) return;
    
    const confirm = await this.messageService.confirm1(`
      <ul>
        <li>사업자등록번호: <strong>${event.value.registrationNo}</strong></li>
        <li>회사명/법인명: <strong>${event.value.companyName}</strong></li>
        <li>회사 소재지: <strong>${event.value.enpBsadr}</strong></li>
        <li>전화번호: <strong>${event.value.enpTlno.replaceAll(' ', '')}</strong></li>
        <li>대표자명: <strong>${event.value.enpRprFnm}</strong></li>
      </ul>
      <p class="mt-2">해당 회사를 선택하시겠어요?</p>
    `);
    if (!confirm) return;

    this.dialogRef.close({
      companyName: event.value.companyName,
      corporateName: event.value.corporateName,
      registrationNo: event.value.registrationNo,
    });
  }

  /** 회사를 추가한다. */
  addCompany(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 회사 검색어로 매칭되는 검색 결과가 있는지 확인한다. */
  private hasCompanyNameValue(companyName: string, searchValue: string): boolean {
    return companyName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  }

}
