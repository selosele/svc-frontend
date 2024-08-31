import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeService } from '@app/code/code.service';
import { SaveVacationRequestDTO, VacationResponseDTO } from '@app/human/human.model';
import { HumanService } from '@app/human/human.service';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { UiMessageService } from '@app/shared/services';
import { isObjectEmpty } from '@app/shared/utils';

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
  selector: 'human-vacation-detail',
  templateUrl: './human-vacation-detail.component.html',
  styleUrl: './human-vacation-detail.component.scss'
})
export class HumanVacationDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 근무이력 ID */
  get workHistoryId(): number {
    return this.humanService.workHistoryId.value;
  }

  /** 휴가 정보 */
  @Input() vacationDetail: VacationResponseDTO = null;

  /** 휴가 상세 조회 폼 */
  vacationDetailForm: FormGroup;

  /** 휴가 구분 코드 데이터 목록 */
  vacationTypeCodes: DropdownData[] = this.codeService.getDropdownData('VACATION_TYPE_00');

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.vacationDetailForm = this.fb.group({
      vacationId: [''],                                       // 휴가 ID
      workHistoryId: [''],                                // 근무이력 ID
      vacationTypeCode: ['', [FormValidator.required]],       // 휴가 구분 코드
      vacationStartYmd: ['', [FormValidator.required]],       // 휴가 시작일자
      vacationEndYmd: ['', [FormValidator.required]],         // 휴가 종료일자
      vacationContent: ['', FormValidator.maxLength(100)],    // 휴가 내용
    });

    this.humanService.workHistoryId$.subscribe((data) => {
      if (!data) return;
      this.vacationDetailForm.get('workHistoryId').patchValue(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vacationDetail && this.vacationDetailForm) {
      this.useRemove = true;

      if (isObjectEmpty(changes.vacationDetail.currentValue)) {
        this.useRemove = false;
        this.vacationDetailForm.reset({
          workHistoryId: this.workHistoryId,
        });
        return;
      }

      this.vacationDetailForm.patchValue({
        ...this.vacationDetail,
        workHistoryId: this.workHistoryId,
      });
    }
  }

  /** 휴가 정보를 저장한다. */
  async onSubmit(value: SaveVacationRequestDTO): Promise<void> {
    console.log(value);
  }

  /** 휴가를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('휴가를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.humanService.removeVacation$(this.vacationDetail.vacationId)
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
