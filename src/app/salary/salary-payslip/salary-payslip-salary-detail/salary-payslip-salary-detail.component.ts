import { Component } from '@angular/core';
import { CoreBaseComponent } from '@app/shared/components/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UiMessageService } from '@app/shared/services';
import { PayslipService } from '@app/payslip/payslip.service';
import { PayslipResultDTO } from '@app/payslip/payslip.model';
import { isEmpty } from '@app/shared/utils';
import { UiButtonComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
  ],
  selector: 'salary-payslip-salary-detail',
  templateUrl: './salary-payslip-salary-detail.component.html',
  styleUrl: './salary-payslip-salary-detail.component.scss'
})
export class SalaryPayslipSalaryDetailComponent extends CoreBaseComponent {

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private payslipService: PayslipService,
  ) {
    super();
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

  /** 이전/다음 급여명세서로 이동한다. */
  goPrevNextPayslip(payslipId: number, payslipPaymentYmd: string): void {
    if (isEmpty(payslipId)) {
      return;
    }
    this.dialogRef.close({ action: 'reload', data: { payslipId, payslipPaymentYmd } });
  }

  /** 급여명세서 수정 modal을 표출한다. */
  updatePayslip(payslip: PayslipResultDTO): void {
    this.dialogRef.close({ action: 'update', data: payslip });
  }

  /** 급여명세서를 삭제한다. */
  async removePayslip(payslipId: number) {
    const confirm = await this.messageService.confirm2('급여명세서를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.payslipService.removePayslip$(payslipId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.dialogRef.close({ action: 'save' });
    });
  }

}
