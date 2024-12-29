import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HumanService } from '@app/human/human.service';
import { CompanyApplyResponseDTO, SaveCompanyApplyRequestDTO } from '@app/human/human.model';
import { UiMessageService } from '@app/shared/services';
import { isObjectEmpty } from '@app/shared/utils';
import { FormValidator, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiContentTitleComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiHiddenFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'human-my-info-company-apply-detail',
  templateUrl: './human-my-info-company-apply-detail.component.html',
  styleUrl: './human-my-info-company-apply-detail.component.scss'
})
export class HumanMyInfoCompanyApplyDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private humanService: HumanService,
  ) {}

  /** 회사등록신청 정보 */
  @Input() detail: CompanyApplyResponseDTO = null;

  /** 회사등록신청 상세 조회 폼 */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = false;

  /** 반려 상태 여부 */
  isReject = false;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.detailForm = this.fb.group({
      companyApplyId: [''],                           // 회사등록신청 ID
      registrationNo: [''],                           // 사업자등록번호
      corporateName: [''],                            // 법인명
      companyName: ['', [FormValidator.required]],    // 회사명
      applyContent: [''],                             // 신청 내용
      applyStateCode: [''],                           // 신청 상태 코드
      applyStateCodeName: [''],                       // 신청 상태 코드명
      applyDt: [''],                                  // 신청일시
      rejectContent: [''],                            // 반려 사유
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.detailForm.reset();

      if (isObjectEmpty(changes.detail.currentValue)) {
        return;
      }

      // 반려
      if (this.detail.applyStateCode === 'REJECT') {
        this.isReject = true;
      } else {
        this.isReject = false;
      }
      
      this.detailForm.patchValue(this.detail);
    }
  }

  /** 회사등록신청정보를 저장한다. */
  async onSubmit(value: SaveCompanyApplyRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('재신청하시겠어요?');
    if (!confirm) return;

    // 반려 후 재신청은 프로세스를 '신청'부터 다시 시작 
    value.applyStateCode = 'NEW';

    this.humanService.updateCompanyApply$(value)
    .subscribe((data) => {
      this.messageService.toastSuccess('정상적으로 재신청되었어요.');
      this.refresh.emit();
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
