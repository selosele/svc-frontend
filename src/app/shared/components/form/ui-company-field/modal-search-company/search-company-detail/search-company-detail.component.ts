import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiMessageService } from '@app/shared/services';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { UiSplitFormComponent } from '../../../ui-split-form/ui-split-form.component';
import { FormValidator } from '../../../form-validator/form-validator.component';
import { UiTextFieldComponent } from '../../../ui-text-field/ui-text-field.component';
import { UiTextareaComponent } from '../../../ui-textarea/ui-textarea.component';
import { HumanService } from '@app/human/human.service';
import { SaveCompanyApplyRequestDTO } from '@app/human/human.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiContentTitleComponent,
  ],
  selector: 'search-company-detail',
  templateUrl: './search-company-detail.component.html',
  styleUrl: './search-company-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchCompanyDetailComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private humanService: HumanService,
  ) {}

  /** 회사 상세 조회 폼 */
  detailForm: FormGroup;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({
      corporateName: ['', [FormValidator.maxLength(100)]], // 법인명
      companyName: ['', [                                  // 회사명
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      registrationNo: ['', [FormValidator.maxLength(10)]], // 사업자등록번호
      applyContent: ['', [FormValidator.maxLength(100)]]   // 신청 내용
    });
  }

  /** 회사등록신청을 한다. */
  async onSubmit(value: SaveCompanyApplyRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('회사등록신청하시겠어요?');
    if (!confirm) return;

    this.humanService.addCompanyApply$(value)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 등록신청되었어요. 마이페이지 > 회사등록신청현황에서 확인해주세요.');
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
