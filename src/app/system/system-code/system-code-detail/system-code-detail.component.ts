import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeResponseDTO, SaveCodeRequestDTO } from '@app/code/code.model';
import { CodeService } from '@app/code/code.service';
import { FormValidator, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { UiMessageService } from '@app/shared/services';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';

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
  selector: 'system-code-detail',
  templateUrl: './system-code-detail.component.html',
  styleUrl: './system-code-detail.component.scss'
})
export class SystemCodeDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private codeService: CodeService,
  ) {}

  /** 코드 정보 */
  @Input() codeDetail: CodeResponseDTO = null;

  /** 코드 상세 조회 폼 */
  codeDetailForm: FormGroup;

  /** 사용 여부 데이터 목록 */
  useYns = this.codeService.createYnCodeData();

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.codeDetailForm = this.fb.group({
      originalCodeId: [''],                              // 기존 코드 ID
      codeId: ['', [                                     // 코드 ID
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      upCodeId: ['', [FormValidator.maxLength(30)]],     // 상위 코드 ID
      codeValue: ['', [                                  // 코드 값
        FormValidator.required,
        FormValidator.maxLength(10)
      ]],
      codeName: ['', [                                   // 코드명
        FormValidator.required,
        FormValidator.maxLength(100)]
      ],
      codeContent: ['', [FormValidator.maxLength(100)]], // 코드 내용
      codeOrder: ['', [                                  // 코드 순서
        FormValidator.required,
        FormValidator.numeric
      ]],
      codeDepth: ['', [                                  // 코드 뎁스
        FormValidator.required,
        FormValidator.numeric
      ]],
      useYn: ['', [FormValidator.required]],             // 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.codeDetail && this.codeDetailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.codeDetail.currentValue)) {
        this.useRemove = false;
        this.codeDetailForm.reset();
        return;
      }

      this.codeDetailForm.patchValue({
        originalCodeId: this.codeDetail.codeId,
        ...this.codeDetail
      });
    }
  }

  /** 코드 정보를 저장한다. */
  async onSubmit(value: SaveCodeRequestDTO): Promise<void> {
    const crudName = isEmpty(value.originalCodeId) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`코드 정보를 ${crudName}하시겠습니까?`);
    if (!confirm) return;

    // 코드 ID가 없으면 추가 API를 타고
    if (isEmpty(value.originalCodeId)) {
      this.codeService.addCode$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.codeService.updateCode$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
  }

  /** 코드를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('코드를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.codeService.removeCode$(this.codeDetail.codeId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었습니다.');
      this.remove.emit();
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
