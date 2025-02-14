import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreBaseComponent } from '@app/shared/components/core';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiMessageService } from '@app/shared/services';
import { WorkHistoryService } from '@app/work-history/work-history.service';
import { PayslipService } from '@app/payslip/payslip.service';
import { PayslipResultDTO, SavePayslipRequestDTO } from '@app/payslip/payslip.model';
import { dateUtil, isEmpty, isObjectEmpty } from '@app/shared/utils';
import { TransformToDto } from '@app/shared/decorators';

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
    UiButtonComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'modal-save-salary-payslip',
  templateUrl: './save-salary-payslip.component.html',
  styleUrl: './save-salary-payslip.component.scss'
})
export class SaveSalaryPayslipComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private workHistoryService: WorkHistoryService,
    private payslipService: PayslipService,
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

  /** 급여명세서 급여내역 상세 */
  get payslipSalaryDetailList() {
    return this.payslipForm.get('payslipSalaryDetailList') as FormArray;
  }

  /** 게시글 추가/수정/삭제 등의 action */
  get action(): string {
    return this.config.data['action'];
  }

  /** 제목 */
  title = `0000년 00월 급여명세서`;

  /** 입사일자 */
  joinYmd: string;

  /** 급여명세서 form */
  payslipForm: FormGroup;

  ngOnInit() {
    this.initForm();

    // 급여명세서 신규 추가일 경우
    if (isObjectEmpty(this.payslip)) {
      this.getWorkHistory();
    } else {
      this.getWorkHistory();
      this.setFormValue();
      this.setTitle(this.payslip.payslipPaymentYmd);
    }
  }

  /** 급여명세서 form을 설정한다. */
  initForm(): void {
    this.payslipForm = this.fb.group({
      userId: [this.user?.userId],                       // 사용자 ID
      payslipId: [''],                                   // 급여명세서 ID
      workHistoryId: [this.workHistoryId],               // 근무이력 ID
      payslipPaymentYmd: ['', [FormValidator.required]], // 급여명세서 지급일자
      payslipNote: ['', [FormValidator.maxLength(255)]], // 급여명세서 비고
      rankCode: ['', [FormValidator.required]],          // 직위 코드

      // 급여명세서 급여내역 상세
      payslipSalaryDetailList: this.fb.array([]),
    });

    [...this.salaryAmountA00Codes, ...this.salaryAmountB00Codes].forEach((x) => {
      this.payslipSalaryDetailList.push(this.fb.group({
        salaryTypeCode: [(() => {    // 급여내역 구분 코드
          if (x.value.startsWith('A')) return this.salaryTypeA00code.value;
          if (x.value.startsWith('B')) return this.salaryTypeB00code.value;
          return '';
        })()],
        salaryAmountCode: [x.value], // 급여내역 금액 코드
        salaryAmount: [''],          // 급여내역 금액
      }));
    });
  }

  /** 급여명세서를 저장한다. */
  @TransformToDto(SavePayslipRequestDTO)
  async onSubmit(value: SavePayslipRequestDTO): Promise<void> {
    const crudName = (isEmpty(value.payslipId) || this.action === this.actions.COPY) ? '등록' : '수정';

    const confirm = await this.messageService.confirm1(`${crudName}하시겠어요?`);
    if (!confirm) return;

    // 급여명세서 ID가 없거나 복사 등록일 경우 추가 API를 타고
    if (isEmpty(value.payslipId) || this.action === this.actions.COPY) {
      this.payslipService.addPayslip$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close({ action: this.actions.SAVE });
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.payslipService.updatePayslip$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close({ action: this.actions.SAVE });
      });
    }
  }

  /** 급여지급일 input 값을 변경한다. */
  onPayslipPaymentYmdChange(event?: Date): void {
    this.setTitle(event);
  }

  /** 급여내역 금액 input 값을 변경한다. */
  onSalaryAmountChange(event: Event, salaryAmountCode: string, controlName: string): void {
    const value = (event.target as HTMLInputElement).value;
    const formControl = this.getPayslipSalaryDetailControl(salaryAmountCode, controlName);
    formControl.patchValue(this.numberWithCommas(value));
  }

  /** 급여명세서 급여내역 상세 form 컨트롤을 반환한다. */
  getPayslipSalaryDetailControl(salaryAmountCode: string, controlName: string): AbstractControl {
    const formArray = this.payslipForm.get('payslipSalaryDetailList') as FormArray;
    const formControl = formArray.controls.find(x => x.value['salaryAmountCode'] === salaryAmountCode);
    return formControl?.get(controlName);
  }

  /** 급여명세서 조회 화면으로 돌아간다. */
  goToPayslip(): void {
    const payslipId = this.payslipForm.get('payslipId').value;
    const payslipPaymentYmd = this.payslipForm.get('payslipPaymentYmd').value;

    this.dialogRef.close({ action: this.actions.RELOAD, data: { payslipId, payslipPaymentYmd } });
  }

  /** 근무이력을 조회한다. */
  private getWorkHistory(): void {
    this.workHistoryService.getWorkHistory$(this.user?.employeeId, this.workHistoryId)
    .subscribe((response) => {
      this.payslipForm.get('rankCode').patchValue(response.workHistory.rankCode);
      this.joinYmd = dateUtil(response.workHistory.joinYmd).format('YYYY-MM-DD');
    });
  }

  /** 급여명세서 form 값을 설정한다. */
  private setFormValue(): void {
    this.payslipForm.patchValue({
      ...this.payslip,
      payslipPaymentYmd: dateUtil(this.payslip.payslipPaymentYmd).format('YYYY-MM-DD')
    });

    for (const i of this.payslipSalaryDetailList.controls) {
      i.get('salaryAmount').patchValue(this.numberWithCommas(i.value['salaryAmount']));
    }
  }

  /** 급여명세서 제목을 설정한다. */
  private setTitle(title: string | Date): void {
    if (isEmpty(title)) {
      this.title = `0000년 00월 급여명세서 (${this.payslip.companyName})`;
    } else {
      const date = dateUtil(title).format('YYYY년 MM월');
      this.title = `${date} 급여명세서 (${this.payslip.companyName})`;
    }
  }

}
