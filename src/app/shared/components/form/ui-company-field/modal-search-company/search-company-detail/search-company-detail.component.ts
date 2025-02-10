import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiMessageService } from '@app/shared/services';
import { UiCardComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { UiSplitFormComponent } from '../../../ui-split-form/ui-split-form.component';
import { FormValidator } from '../../../form-validator/form-validator.component';
import { UiTextFieldComponent } from '../../../ui-text-field/ui-text-field.component';
import { UiTextareaComponent } from '../../../ui-textarea/ui-textarea.component';
import { CompanyService } from '@app/company/company.service';
import { SaveCompanyApplyRequestDTO } from '@app/company/company.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiContentTitleComponent,
    UiCardComponent,
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
    private companyService: CompanyService,
  ) {}

  /** 회사 상세 조회 form */
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
      registrationNo: ['', [                               // 사업자등록번호
        FormValidator.required,
        FormValidator.maxLength(10)]
      ],
      applyContent: ['', [FormValidator.maxLength(100)]]   // 신청 내용
    });
  }

  /** 회사등록신청을 한다. */
  async onSubmit(value: SaveCompanyApplyRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('등록신청하시겠어요?<br>신청 후에는 취소할 수 없으니 신중하게 입력해주세요.');
    if (!confirm) return;

    this.companyService.addCompanyApply$(value)
    .subscribe((response) => {
      this.messageService.toastSuccess('정상적으로 등록신청되었어요. 마이페이지 > 회사등록신청현황에서 확인해주세요.');
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
