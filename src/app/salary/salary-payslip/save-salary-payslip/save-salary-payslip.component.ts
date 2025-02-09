import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiSkeletonComponent } from '@app/shared/components/ui';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { WorkHistoryService } from '@app/work-history/work-history.service';
import { PayslipResultDTO } from '@app/payslip/payslip.model';
import { dateUtil, isEmpty, isObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiDateFieldComponent,
    UiDropdownComponent,
    UiSkeletonComponent,
  ],
  selector: 'modal-save-salary-payslip',
  templateUrl: './save-salary-payslip.component.html',
  styleUrl: './save-salary-payslip.component.scss'
})
export class SaveSalaryPayslipComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private workHistoryService: WorkHistoryService,
  ) {
    super();
  }

  /** 급여명세서 */
  get payslip(): PayslipResultDTO {
    return this.config.data['payslip'];
  }

  /** 근무이력 ID */
  get workHistoryId(): number {
    return this.config.data['workHistoryId'];
  }

  /** 지급내역 코드 데이터 */
  get salaryTypeA00code(): DropdownData {
    return (this.config.data['salaryTypecodes'] as DropdownData[])
      .find(x => x.value === 'A00');
  }

  /** 공제내역 코드 데이터 */
  get salaryTypeB00code(): DropdownData {
    return (this.config.data['salaryTypecodes'] as DropdownData[])
      .find(x => x.value === 'B00');
  }

  /** 지급내역 금액 코드 데이터 목록 */
  get salaryAmountA00Codes(): DropdownData[] {
    return this.config.data['salaryAmountA00Codes'];
  }

  /** 공제내역 금액 코드 데이터 목록 */
  get salaryAmountB00Codes(): DropdownData[] {
    return this.config.data['salaryAmountB00Codes'];
  }

  /** 직위 코드 데이터 목록 */
  get rankCodes(): DropdownData[] {
    return this.config.data['rankCodes'];
  }

  /** 제목 */
  title = '0000년 00월 급여명세서';

  /** 입사일자 */
  joinYmd: string;

  /** 급여명세서 폼 */
  payslipForm: FormGroup;

  ngOnInit() {
    this.payslipForm = this.fb.group({
      payslipId: [''],                                   // 급여명세서 ID
      workHistoryId: [''],                               // 근무이력 ID
      payslipPaymentYmd: ['', [FormValidator.required]], // 급여명세서 지급일자
      payslipNote: ['', [FormValidator.maxLength(255)]], // 급여명세서 비고
      rankCode: ['', [FormValidator.required]],          // 직위 코드

      // 급여명세서 급여내역 상세
      payslipSalaryDetail: this.fb.group({
        salaryId: [''],         // 급여내역 상세 ID
        salaryTypeCode: [''],   // 급여내역 구분 코드
        salaryAmountCode: [''], // 급여내역 금액 코드
        salaryAmount: [''],     // 급여내역 금액
      }),
    });

    // 급여명세서 신규 추가일경우 근무이력을 조회해서 필요한 정보를 설정한다.
    if (isObjectEmpty(this.payslip)) {
      this.getWorkHistory();
    } else {
      this.payslipForm.get('rankCode').patchValue(this.user?.rankCode);
    }
  }

  /** 급여명세서를 저장한다. */
  onSubmit(value): void {
    console.log(value);
  }

  /** 급여지급일 input 값을 변경한다. */
  onPayslipPaymentYmdChange(event?: Date): void {
    if (isEmpty(event)) {
      this.title = '0000년 00월 급여명세서';
    } else {
      const date = dateUtil(event).format('YYYY년 MM월');
      this.title = `${date} 급여명세서`;
    }
  }

  /** 근무이력을 조회한다. */
  private getWorkHistory(): void {
    this.workHistoryService.getWorkHistory$(this.user?.employeeId, this.workHistoryId)
    .subscribe((response) => {
      this.payslipForm.get('rankCode').patchValue(response.workHistory.rankCode);
      this.joinYmd = dateUtil(response.workHistory.joinYmd).format('YYYY-MM-DD');
    });
  }

}
