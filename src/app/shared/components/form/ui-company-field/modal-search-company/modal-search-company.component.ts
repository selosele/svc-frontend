import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StoreService } from '@app/shared/services';
import { HumanService } from '@app/human/human.service';
import { CompanyResponseDTO, GetCompanyRequestDTO } from '@app/human/human.model';
import { FormValidator } from '../../form-validator/form-validator.component';
import { UiFormComponent } from '../../ui-form/ui-form.component';
import { UiTextFieldComponent } from '../../ui-text-field/ui-text-field.component';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '../../../ui';
import { LayoutPageDescriptionComponent } from '../../../layout';
import { SearchCompanyDetailComponent } from './search-company-detail/search-company-detail.component';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
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

  /** 테이블 컬럼 */
  cols = [
    { field: 'corporateName',  header: '법인명' },
    { field: 'companyName',    header: '회사명' },
    { field: 'registrationNo', header: '사업자등록번호' },
  ];

  ngOnInit() {
    if (!this.companyListDataLoad) {
      this.listCompany();
    }

    this.searchForm = this.fb.group({
      corporateName: ['', [FormValidator.maxLength(100)]],       // 법인명
      companyName: ['', [FormValidator.maxLength(100)]],         // 회사명
      registrationNo: ['', [FormValidator.maxLength(10)]]        // 사업자등록번호
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

  /** 회사를 추가한다. */
  addCompany(): void {
    this.detail = {};
    this.splitter.show();
  }

}
