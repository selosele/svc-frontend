import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiSkeletonComponent } from '@app/shared/components/ui';
import { UiDropdownComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { WorkHistoryService } from '@app/work-history/work-history.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiFormComponent,
    UiTextFieldComponent,
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

  /** 근무이력 ID */
  get workHistoryId(): number {
    return this.config.data['workHistoryId'];
  }

  /** 직위 코드 데이터 목록 */
  get rankCodes(): DropdownData[] {
    return this.config.data['rankCodes'];
  }

  /** 급여명세서 폼 */
  payslipForm: FormGroup;

  /** 급여명세서 급여내역 상세 폼 */
  payslipDetailForm: FormGroup;

  ngOnInit() {
    this.payslipForm = this.fb.group({
      rankCode: [this.user?.rankCode], // 직위 코드
    });

    this.payslipDetailForm = this.fb.group({
      originalYmd: [''], // 기존 일자
    });

    // 급여명세서 신규 추가일경우 근무이력을 조회해서 필요한 정보를 설정한다.
    this.getWorkHistory();
  }

  /** 급여명세서를 저장한다. */
  onSubmit(value): void {

  }

  /** 급여명세서 급여내역 상세를 저장한다. */
  onSubmitDetail(value): void {

  }

  /** 근무이력을 조회한다. */
  private getWorkHistory(): void {
    this.workHistoryService.getWorkHistory$(this.user?.employeeId, this.workHistoryId)
    .subscribe((data) => {
      this.payslipForm.get('rankCode').patchValue(data.rankCode);
    });
  }

}
