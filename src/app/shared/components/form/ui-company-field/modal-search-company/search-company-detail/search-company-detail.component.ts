import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiMessageService } from '@app/shared/services';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { UiSplitFormComponent } from '../../../ui-split-form/ui-split-form.component';
import { FormValidator } from '../../../form-validator/form-validator.component';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
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
  ) {}

  /** 회사 상세 조회 폼 */
  detailForm: FormGroup;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({
      corporateName: ['', [FormValidator.maxLength(100)]],       // 법인명
      companyName: ['', [FormValidator.maxLength(100)]],         // 회사명
      registrationNo: ['', [FormValidator.maxLength(10)]]        // 사업자등록번호
    });
  }

  /** 회사 정보를 추가한다. */
  async onSubmit(value): Promise<void> {
    const confirm = await this.messageService.confirm1('회사 정보를 등록하시겠습니까?');
    if (!confirm) return;

    
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
