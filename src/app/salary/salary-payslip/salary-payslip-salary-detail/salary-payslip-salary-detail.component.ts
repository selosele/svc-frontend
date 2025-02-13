import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreBaseComponent } from '@app/shared/components/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileService, UiMessageService } from '@app/shared/services';
import { PayslipService } from '@app/payslip/payslip.service';
import { PayslipResultDTO } from '@app/payslip/payslip.model';
import { dateUtil, isEmpty, isNotEmpty } from '@app/shared/utils';
import { UiButtonComponent } from '@app/shared/components/ui';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
  ],
  selector: 'salary-payslip-salary-detail',
  templateUrl: './salary-payslip-salary-detail.component.html',
  styleUrl: './salary-payslip-salary-detail.component.scss'
})
export class SalaryPayslipSalaryDetailComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private fileService: FileService,
    private payslipService: PayslipService,
  ) {
    super();
  }

  /** 급여명세서 조회 화면 */
  @ViewChild('salaryDetailView') salaryDetailView: ElementRef<HTMLElement>;

  /** 제목 */
  title: string;

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

  /** 급여명세서 */
  get payslip(): PayslipResultDTO {
    return this.config.data['payslip'];
  }

  /** 이전/다음 급여명세서 목록 */
  get payslipList(): PayslipResultDTO[] {
    return this.config.data['payslipList'];
  }

  /** 이전 급여명세서 */
  get prevPayslip() {
    return this.payslipList?.find(x => x.prevNextFlag === 'PREV');
  }

  /** 다음 급여명세서 */
  get nextPayslip() {
    return this.payslipList?.find(x => x.prevNextFlag === 'NEXT');
  }

  ngOnInit() {
    const date = dateUtil(this.payslip.payslipPaymentYmd).format('YYYY년 MM월');
    this.title = `${date} 급여명세서 (${this.payslip.companyName} - ${this.payslip.totalAmount}원)`;
  }

  /** 이전/다음 급여명세서로 이동한다. */
  goPrevNextPayslip(payslipId: number, payslipPaymentYmd: string): void {
    if (isEmpty(payslipId)) {
      return;
    }
    this.dialogRef.close({ action: this.actions.RELOAD, data: { payslipId, payslipPaymentYmd } });
  }

  /** 급여명세서 수정(or 복사) modal을 표출한다. */
  updatePayslip(payslip: PayslipResultDTO, action = this.actions.UPDATE): void {
    this.dialogRef.close({ action, data: payslip });
  }

  /** 급여명세서를 삭제한다. */
  async removePayslip(payslipId: number) {
    const confirm = await this.messageService.confirm2('급여명세서를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.payslipService.removePayslip$(payslipId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.dialogRef.close({ action: this.actions.SAVE });
    });
  }

  /** 급여명세서를 PDF로 다운로드 받는다. */
  async exportPdf(): Promise<void> {
    this.fileService.exportPdf({
      element: this.salaryDetailView.nativeElement,
      fileName: `급여명세서(${this.payslip.companyName}, ${this.user?.employeeName}).pdf`,
      ignoreElements: ['btnExportPdf'],
      orientation: 'landscape',
      margin: 10,
    });
  }

  /** 급여내역 금액이 존재하는지 확인한다(금액이 0일 경우 false로 평가되는 현상을 피하기 위함). */
  isSalaryAmountExist(value: number): boolean {
    return isNotEmpty(value);
  }

}
