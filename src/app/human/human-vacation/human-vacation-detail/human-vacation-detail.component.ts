import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaveVacationRequestDTO, VacationResponseDTO } from '@app/vacation/vacation.model';
import { VacationService } from '@app/vacation/vacation.service';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { TransformToDto } from '@app/shared/decorators';
import { UiMessageService } from '@app/shared/services';
import { WorkHistoryStore } from '@app/work-history/work-history.store';
import { dateUtil, isEmpty, isObjectEmpty } from '@app/shared/utils';

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
    private route: ActivatedRoute,
    private workHistoryStore: WorkHistoryStore,
    private messageService: UiMessageService,
    private vacationService: VacationService,
  ) {}

  /** 근무이력 ID */
  get workHistoryId() {
    return this.workHistoryStore.select<number>('workHistoryId').value;
  }

  /** 휴가 정보 */
  @Input() detail: VacationResponseDTO = null;

  /** 휴가 상세 조회 폼 */
  detailForm: FormGroup;

  /** 휴가 구분 코드 데이터 목록 */
  vacationTypeCodes: DropdownData[];

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<number>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({
      vacationId: [''],                                       // 휴가 ID
      workHistoryId: [''],                                    // 근무이력 ID
      vacationTypeCode: ['', [FormValidator.required]],       // 휴가 구분 코드
      vacationStartYmd: ['', [FormValidator.required]],       // 휴가 시작일자
      vacationEndYmd: ['', [FormValidator.required]],         // 휴가 종료일자
      vacationUseCount: ['', [FormValidator.numeric]],        // 휴가 사용일수
      vacationContent: ['', FormValidator.maxLength(100)],    // 휴가 내용
    });

    this.route.data.subscribe(({ code }) => {
      this.vacationTypeCodes = code['VACATION_TYPE_00'];
    });

    this.workHistoryStore.select<number>('workHistoryId').asObservable().subscribe((data) => {
      if (!data) return;
      this.detailForm.get('workHistoryId').patchValue(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;

      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset({
          workHistoryId: this.workHistoryId,
        });
        return;
      }

      this.detailForm.patchValue({
        ...this.detail,
        workHistoryId: this.workHistoryId,
      });
    }
  }

  /** 휴가 정보 저장 유효성 검증을 한다. */
  isValid(): boolean {
    const startYmd: string = this.detailForm.get('vacationStartYmd').value;
    const endYmd: string = this.detailForm.get('vacationEndYmd').value;

    // 휴가 시작일자가 종료일자보다 큰지 확인
    if (dateUtil(startYmd).isAfter(endYmd)) {
      this.messageService.toastError('휴가 시작일자는 종료일자보다 클 수 없어요.');
      return false;
    }

    return true;
  }

  /** 휴가 정보를 저장한다. */
  @TransformToDto(SaveVacationRequestDTO)
  async onSubmit(value: SaveVacationRequestDTO): Promise<void> {
    if (!this.isValid()) return;

    const crudName = isEmpty(value.vacationId) ? '등록' : '수정';

    const confirm = await this.messageService.confirm1(`휴가를 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 휴가 ID가 없으면 추가 API를 타고
    if (isEmpty(value.vacationId)) {
      this.vacationService.addVacation$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.detailForm.get('vacationId').patchValue(data.vacationId);
        this.refresh.emit(data.workHistoryId);
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.vacationService.updateVacation$(value)
      .subscribe(() => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit(value.workHistoryId);
      });
    }
  }

  /** 휴가를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('휴가를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.vacationService.removeVacation$(this.detail.vacationId)
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
