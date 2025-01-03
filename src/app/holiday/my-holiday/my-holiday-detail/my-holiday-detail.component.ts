import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { AuthService } from '@app/auth/auth.service';
import { HolidayService } from '@app/holiday/holiday.service';
import { HolidayResponseDTO, SaveHolidayRequestDTO } from '@app/holiday/holiday.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';
import { AuthenticatedUser } from '@app/auth/auth.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiDropdownComponent,
    UiDateFieldComponent,
    UiHiddenFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'my-holiday-detail',
  templateUrl: './my-holiday-detail.component.html',
  styleUrl: './my-holiday-detail.component.scss'
})
export class MyHolidayDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private authService: AuthService,
    private codeService: CodeService,
    private holidayService: HolidayService,
  ) {}

  /** 휴일 정보 */
  @Input() detail: HolidayResponseDTO = null;

  /** 휴일 상세 조회 폼 */
  detailForm: FormGroup;

  /** 사용 여부 데이터 목록 */
  useYns = this.codeService.createYnCodeData();

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();

    this.detailForm = this.fb.group({
      originalYmd: [''],                                    // 기존 일자
      ymd: ['', [                                           // 일자
        FormValidator.required,
        FormValidator.maxLength(8)
      ]],
      userId: ['', FormValidator.required],                 // 사용자 ID
      holidayName: ['', [                                   // 휴일명
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      holidayContent: ['', [FormValidator.maxLength(100)]], // 휴일 내용
      useYn: ['', [FormValidator.required]],                // 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset({ userId: this.user?.userId, useYn: 'Y' });
        return;
      }

      this.detailForm.patchValue({
        originalYmd: this.detail.ymd,
        ...this.detail,
      });
    }
  }

  /** 휴일 정보를 저장한다. */
  async onSubmit(value: SaveHolidayRequestDTO): Promise<void> {
    const crudName = isEmpty(value.originalYmd) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`휴일 정보를 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 휴일 ID가 없으면 추가 API를 타고
    if (isEmpty(value.originalYmd)) {
      this.holidayService.addHoliday$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.holidayService.updateHoliday$(value)
      .subscribe(() => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
  }

  /** 휴일을 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('휴일을 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.holidayService.removeHoliday$(this.user?.userId, this.detail.ymd)
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
