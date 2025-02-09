import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { UiMessageService } from '@app/shared/services';
import { CompanyService } from '@app/company/company.service';
import { CompanyApplyResultDTO, SaveCompanyApplyRequestDTO } from '@app/company/company.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { FormValidator, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiDropdownComponent,
    UiHiddenFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'system-company-apply-detail',
  templateUrl: './system-company-apply-detail.component.html',
  styleUrl: './system-company-apply-detail.component.scss'
})
export class SystemCompanyApplyDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private companyService: CompanyService,
  ) {}

  /** 회사등록신청 정보 */
  @Input() detail: CompanyApplyResultDTO = null;

  /** 회사등록신청 상세 조회 폼 */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = false;

  /** 반려 가능 상태 여부 */
  isRejectable = false;

  /** 신청 상태 코드 데이터 목록 */
  applyStateCodes: DropdownData[];

  /** 신청 상태 코드명 */
  applyStateCodeName: string;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.route.data.subscribe(({ code }) => {
      this.applyStateCodes = (code['APPLY_STATE_00'] as DropdownData[])
        .filter(x => x.value != 'ACCEPT' && x.value != 'CONFIRM'); // 접수(ACCEPT), 확인(CONFIRM) 코드는 제외
    });

    this.detailForm = this.fb.group({
      companyApplyId: [''],                                     // 회사등록신청 ID
      corporateName: ['', [                                     // 법인명
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      companyName: ['', [                                       // 회사명
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      registrationNo: ['', [FormValidator.maxLength(10)]],      // 사업자등록번호
      applyStateCode: [''],                                     // 신청 상태 코드
      applicantName: [''],                                      // 신청자명
      rejectContent: [''],                                      // 반려 사유
      applyDt: [''],                                            // 신청일시
      applyContent: ['', [FormValidator.maxLength(100)]],       // 신청 내용
      applicantId: [''],                                        // 신청자 ID
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.detail && this.detailForm) {

      // 반려
      if (this.detail.applyStateCode === 'REJECT') {
        this.isRejectable = true;
        this.detailForm.get('rejectContent').setValidators([FormValidator.required]);
      } else {
        this.isRejectable = false;
        this.detailForm.get('rejectContent').clearValidators();
      }

      this.detailForm.patchValue(this.detail);
      this.detailForm.get('rejectContent').updateValueAndValidity();
      this.applyStateCodeName = this.detail.applyStateCodeName;
    }
  }

  /** 신청상태를 선택한다. */
  onApplyStateCodeChange(event: DropdownChangeEvent): void {
    this.applyStateCodeName = this.applyStateCodes.find(x => x.value === event.value).label;
    this.detailForm.get('rejectContent').patchValue('');

    // 반려
    if (event.value === 'REJECT') {
      this.isRejectable = true;
      this.detailForm.get('rejectContent').setValidators([FormValidator.required]);
    } else {
      this.isRejectable = false;
      this.detailForm.get('rejectContent').clearValidators();
    }

    this.detailForm.get('rejectContent').updateValueAndValidity();
  }

  /** 회사등록신청 정보를 저장한다. */
  async onSubmit(value: SaveCompanyApplyRequestDTO): Promise<void> {
    if (value.applyStateCode === 'NEW') {
      this.messageService.toastInfo('신청상태 - 승인 또는 반려 중 하나를 선택해주세요.');
      return;
    }

    const confirm = await this.messageService.confirm1(`${this.applyStateCodeName}하시겠어요?`);
    if (!confirm) return;

    this.companyService.updateCompanyApply$(value)
    .subscribe((response) => {
      this.messageService.toastSuccess(`정상적으로 ${this.applyStateCodeName}되었어요.`);
      this.refresh.emit();
    });
}

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
