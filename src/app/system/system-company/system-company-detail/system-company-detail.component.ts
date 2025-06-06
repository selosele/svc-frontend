import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyResultDTO, SaveCompanyRequestDTO } from '@app/company/company.model';
import { CompanyService } from '@app/company/company.service';
import { UiMessageService } from '@app/shared/services';
import { FormValidator, UiHiddenFieldComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiHiddenFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'system-company-detail',
  templateUrl: './system-company-detail.component.html',
  styleUrl: './system-company-detail.component.scss'
})
export class SystemCompanyDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private companyService: CompanyService,
  ) {}

  /** 회사 정보 */
  @Input() detail: CompanyResultDTO = null;

  /** 회사 상세 조회 form */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({
      companyId: [''],                                          // 회사 ID
      corporateName: ['', [                                     // 법인명
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      companyName: ['', [                                       // 회사명
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      registrationNo: ['', [FormValidator.maxLength(10)]],      // 사업자등록번호
      ceoName: ['', [FormValidator.maxLength(30)]],             // 대표자명
      companyAddr: ['', [FormValidator.maxLength(255)]],        // 회사 소재지
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset();
        return;
      }

      this.detailForm.patchValue(this.detail);
    }
  }

  /** 회사 정보를 저장한다. */
  async onSubmit(value: SaveCompanyRequestDTO): Promise<void> {
    const crudName = isEmpty(value.companyId) ? '등록' : '수정';

    const confirm = await this.messageService.confirm1(`회사 정보를 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 회사 ID가 없으면 추가 API를 타고
    if (isEmpty(value.companyId)) {
      this.companyService.addCompany$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.detailForm.get('companyId').patchValue(response.company.companyId);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.companyService.updateCompany$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
  }

  /** 회사를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('회사를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.companyService.removeCompany$(this.detail.companyId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.remove.emit();
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
