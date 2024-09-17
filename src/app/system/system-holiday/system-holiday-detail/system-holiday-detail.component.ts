import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { HolidayService } from '@app/holiday/holiday.service';
import { HolidayResponseDTO, SaveHolidayRequestDTO } from '@app/holiday/holiday.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiDropdownComponent,
    UiDateFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'system-holiday-detail',
  templateUrl: './system-holiday-detail.component.html',
  styleUrl: './system-holiday-detail.component.scss'
})
export class SystemHolidayDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private codeService: CodeService,
    private holidayService: HolidayService,
  ) {}

  /** 휴일 정보 */
  @Input() holidayDetail: HolidayResponseDTO = null;

  /** 휴일 상세 조회 폼 */
  holidayDetailForm: FormGroup;

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

  ngOnInit() {
    this.holidayDetailForm = this.fb.group({
      ymd: ['', [                                           // 일자
        FormValidator.required,
        FormValidator.maxLength(8)
      ]],
      holidayName: ['', [                                   // 휴일명
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      holidayContent: ['', [FormValidator.maxLength(100)]], // 휴일 내용
      useYn: ['', [FormValidator.required]],                // 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.holidayDetail && this.holidayDetailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.holidayDetail.currentValue)) {
        this.useRemove = false;
        this.holidayDetailForm.reset();
        return;
      }

      this.holidayDetailForm.patchValue(this.holidayDetail);
    }
  }

  /** 휴일 정보를 저장한다. */
  async onSubmit(value: SaveHolidayRequestDTO): Promise<void> {
    const crudName = isEmpty(value.ymd) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`휴일 정보를 ${crudName}하시겠습니까?`);
    if (!confirm) return;

    // 휴일 ID가 없으면 추가 API를 타고
    if (isEmpty(value.ymd)) {
      this.holidayService.addHoliday$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.holidayService.updateHoliday$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
  }

  /** 휴일을 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('휴일을 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.holidayService.removeHoliday$(this.holidayDetail.ymd)
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
