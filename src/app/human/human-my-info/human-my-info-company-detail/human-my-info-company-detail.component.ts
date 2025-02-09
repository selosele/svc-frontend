import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiSplitFormComponent } from '@app/shared/components/form/ui-split-form/ui-split-form.component';
import { UiDateFieldComponent } from '@app/shared/components/form/ui-date-field/ui-date-field.component';
import { UiDropdownComponent } from '@app/shared/components/form/ui-dropdown/ui-dropdown.component';
import { UiHiddenFieldComponent } from '@app/shared/components/form/ui-hidden-field/ui-hidden-field.component';
import { UiCompanyFieldComponent } from '@app/shared/components/form/ui-company-field/ui-company-field.component';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { UiMessageService } from '@app/shared/services';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';
import { WorkHistoryService } from '@app/work-history/work-history.service';
import { SaveWorkHistoryRequestDTO, WorkHistoryResultDTO } from '@app/work-history/work-history.model';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiDateFieldComponent,
    UiDropdownComponent,
    UiHiddenFieldComponent,
    UiCompanyFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'human-my-info-company-detail',
  templateUrl: './human-my-info-company-detail.component.html',
  styleUrl: './human-my-info-company-detail.component.scss'
})
export class HumanMyInfoCompanyDetailComponent extends CoreBaseComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private workHistoryService: WorkHistoryService,
  ) {
    super();
  }

  /** 회사 정보 */
  @Input() detail: WorkHistoryResultDTO = null;

  /** 회사 상세 조회 폼 */
  detailForm: FormGroup;

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[];

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[];

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.route.data.subscribe(({ code }) => {
      this.rankCodes = code['RANK_00'];
      this.jobTitleCodes = code['JOB_TITLE_00'];
    });
    
    this.detailForm = this.fb.group({
      workHistoryId: [''],                            // 근무이력 ID
      companyId: [''],                                // 회사 ID
      registrationNo: [''],                           // 사업자등록번호
      companyName: ['', [FormValidator.required]],    // 회사명
      corporateName: [''],                            // 법인명
      rankCode: ['', [FormValidator.required]],       // 직위 코드
      jobTitleCode: ['', [FormValidator.required]],   // 직책 코드
      joinYmd: ['', [FormValidator.required]],        // 입사일자
      quitYmd: [''],                                  // 퇴사일자
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      this.detailForm.reset();

      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        return;
      }
      
      this.detailForm.patchValue(this.detail);
    }
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

  /** 회사 정보를 저장한다. */
  async onSubmit(value: SaveWorkHistoryRequestDTO): Promise<void> {
    const crudName = isEmpty(value.workHistoryId) ? '등록' : '수정';

    const confirm = await this.messageService.confirm1(`회사 정보를 ${crudName}하시겠어요?`);
    if (!confirm) return;

    value.employeeId = this.user?.employeeId;

    // 근무이력 ID가 없으면 추가 API를 타고
    if (isEmpty(value.workHistoryId)) {
      this.workHistoryService.addWorkHistory$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.detailForm.get('workHistoryId').patchValue(response.workHistory.workHistoryId);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.workHistoryService.updateWorkHistory$(value)
      .subscribe(() => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
  }

  /** 회사 정보를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('회사를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    const { employeeId } = this.user;
    const workHistoryId = this.detailForm.get('workHistoryId').value;

    this.workHistoryService.removeWorkHistory$(employeeId, workHistoryId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.remove.emit();
    });
  }

}
