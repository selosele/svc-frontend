import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiSplitFormComponent } from '@app/shared/components/form/ui-split-form/ui-split-form.component';
import { UiDateFieldComponent } from '@app/shared/components/form/ui-date-field/ui-date-field.component';
import { UiDropdownComponent } from '@app/shared/components/form/ui-dropdown/ui-dropdown.component';
import { UiHiddenFieldComponent } from '@app/shared/components/form/ui-hidden-field/ui-hidden-field.component';
import { UiCompanyFieldComponent } from '@app/shared/components/form/ui-company-field/ui-company-field.component';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { WorkHistoryResponseDTO, SaveWorkHistoryRequestDTO } from '@app/human/human.model';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';
import { HumanService } from '@app/human/human.service';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { UiContentTitleComponent } from '@app/shared/components/ui';

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
export class HumanMyInfoCompanyDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private authService: AuthService,
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 회사 정보 */
  @Input() workHistoryDetail: WorkHistoryResponseDTO = null;

  /** 회사 상세 조회 폼 */
  companyDetailForm: FormGroup;

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[] = this.codeService.createDropdownData('RANK_00');

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[] = this.codeService.createDropdownData('JOB_TITLE_00');

  /** 연차발생기준 코드 데이터 목록 */
  annualTypeCodes: DropdownData[] = this.codeService.createDropdownData('ANNUAL_TYPE_00');

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

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
    
    this.companyDetailForm = this.fb.group({
      workHistoryId: [''],                            // 근무이력 ID
      companyId: [''],                                // 회사 ID
      companyName: ['', [FormValidator.required]],    // 회사명
      rankCode: ['', [FormValidator.required]],       // 직위 코드
      jobTitleCode: ['', [FormValidator.required]],   // 직책 코드
      annualTypeCode: ['', [FormValidator.required]], // 연차발생기준 코드
      joinYmd: ['', [FormValidator.required]],        // 입사일자
      quitYmd: [''],                                  // 퇴사일자
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workHistoryDetail && this.companyDetailForm) {
      this.useRemove = true;
      this.companyDetailForm.reset();

      if (isObjectEmpty(changes.workHistoryDetail.currentValue)) {
        this.useRemove = false;
        return;
      }
      
      this.companyDetailForm.patchValue(this.workHistoryDetail);
    }
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

  /** 회사 정보를 저장한다. */
  async onSubmit(value: SaveWorkHistoryRequestDTO): Promise<void> {
    const crudName = isEmpty(value.workHistoryId) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`회사 정보를 ${crudName}하시겠습니까?`);
    if (!confirm) return;

    value.employeeId = this.user.employeeId;

    // 근무이력 ID가 없으면 추가 API를 타고
    if (isEmpty(value.workHistoryId)) {
      this.humanService.addWorkHistory$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.humanService.updateWorkHistory$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
  }

  /** 회사 정보를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('회사를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    const { employeeId } = this.user;
    const workHistoryId = this.companyDetailForm.get('workHistoryId').value;

    this.humanService.removeWorkHistory$(employeeId, workHistoryId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었습니다.');
      this.remove.emit();
    });
  }

}
