import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HumanService } from '@app/human/human.service';
import { CompanyResponseDTO, GetCompanyRequestDTO } from '@app/human/human.model';
import { FormValidator } from '../../form-validator/form-validator.component';
import { UiFormComponent } from '../../ui-form/ui-form.component';
import { UiTextFieldComponent } from '../../ui-text-field/ui-text-field.component';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '../../../ui';
import { LayoutPageDescriptionComponent } from '../../../layout';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    UiTableComponent,
    UiSkeletonComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'modal-search-company',
  templateUrl: './modal-search-company.component.html',
  styleUrl: './modal-search-company.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalSearchCompanyComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private humanService: HumanService,
    private dialogRef: DynamicDialogRef,
  ) {}

  /** 회사 목록 */
  get companyList(): CompanyResponseDTO[] {
    return this.humanService.companyList.value;
  }

  /** 회사 목록 데이터 로드 완료 여부 */
  get companyListDataLoad(): boolean {
    return this.humanService.companyListDataLoad.value;
  }

  /** 회사 목록 데이터 로드 완료 여부 값을 설정한다. */
  set companyListDataLoad(value: boolean) {
    this.humanService.companyListDataLoad.next(value);
  }

  /** 회사 검색 폼 */
  searchForm: FormGroup;

  /** 테이블 컬럼 */
  cols = [
    { field: 'corporateName',      header: '법인명' },
    { field: 'companyName',        header: '회사명' },
    { field: 'registrationNo',     header: '사업자등록번호' },
  ];

  ngOnInit(): void {
    if (!this.companyListDataLoad) {
      this.listCompany();
    }

    this.searchForm = this.fb.group({
      corporateName: ['', [FormValidator.maxLength(100)]],       // 법인명
      companyName: ['', [FormValidator.maxLength(100)]],         // 회사명
      registrationNo: ['', [FormValidator.maxLength(10)]]        // 사업자등록번호
    });

    // 모달이 닫히면 데이터 로드 완료 여부 값을 초기화해서 모달이 다시 열리면 다시 조회되도록 해준다.
    this.dialogRef.onClose.subscribe(() => {
      this.companyListDataLoad = false;
    });
  }

  /** 회사 목록을 조회한다. */
  listCompany(): void {
    this.humanService.listCompany();
  }

  /** 회사를 검색한다. */
  onSubmit(value: GetCompanyRequestDTO): void {
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

}
