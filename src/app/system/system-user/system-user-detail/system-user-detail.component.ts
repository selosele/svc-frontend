import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleResponseDTO, SaveUserRequestDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiCompanyFieldComponent, UiDateFieldComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { isObjectEmpty, isNotObjectEmpty, isEmpty } from '@app/shared/utils';
import { UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiCheckboxComponent,
    UiCheckboxGroupComponent,
    UiDropdownComponent,
    UiDateFieldComponent,
    UiCompanyFieldComponent,
    UiButtonComponent,
    UiHiddenFieldComponent,
    UiContentTitleComponent,
  ],
  selector: 'system-user-detail',
  templateUrl: './system-user-detail.component.html',
  styleUrl: './system-user-detail.component.scss'
})
export class SystemUserDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private authService: AuthService,
    private codeService: CodeService,
  ) {}

  /** 사용자 정보 */
  @Input() userDetail: UserResponseDTO = null;

  /** 사용자 상세 조회 폼 */
  userDetailForm: FormGroup;

  /** 사용자 활성화 여부 데이터 목록 */
  userActiveYns: DropdownData[] = this.codeService.getDropdownYnData();

  /** 사용자 활성화 여부 기본 값 */
  defaultUserActiveYn: string = 'Y';

  /** 모든 권한 목록 */
  roles: RoleResponseDTO[] = [];

  /** 권한 목록 기본 값 */
  defaultRoles: string[] = [];

  /** 성별 코드 데이터 목록 */
  genderCodes: DropdownData[] = this.codeService.getDropdownData('GENDER_00');

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[] = this.codeService.getDropdownData('RANK_00');

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[] = this.codeService.getDropdownData('JOB_TITLE_00');

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 사용자 정보 존재 여부 */
  get isUserNotEmpty(): boolean {
    return isNotObjectEmpty(this.userDetail);
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({

      // 사용자 정보
      userId: [''],                                           // 사용자 ID
      userAccount: ['', [
        FormValidator.required,
        FormValidator.maxLength(20)                           // 사용자 계정
      ]],
      userPassword: ['', [                                    // 사용자 비밀번호
        FormValidator.required,
        FormValidator.maxLength(12)
      ]],
      userActiveYn: ['', [FormValidator.required]],           // 사용자 활성화 여부
      roles: ['', [FormValidator.required]],                  // 사용자 권한

      // 직원 정보
      employee: this.fb.group({
        employeeId: [''],                                     // 직원 ID
        employeeName: ['', [                                  // 직원명
          FormValidator.required,
          FormValidator.maxLength(30),
        ]],
        genderCode: ['', [FormValidator.required]],           // 성별 코드
        birthYmd: ['', [FormValidator.required]],             // 생년월일
        phoneNo: ['', [FormValidator.required]],              // 휴대폰번호

        // 회사 정보
        workHistory: this.fb.group({
          workHistoryId: [''],                                // 근무이력 ID
          companyId: [''],                                    // 회사 ID
          corporateName: ['', [FormValidator.required]],      // 법인명
          companyName: ['', [FormValidator.required]],        // 회사명
          joinYmd: ['', [FormValidator.required]],            // 입사일자
          quitYmd: [''],                                      // 퇴사일자
          rankCode: ['', [FormValidator.required]],           // 직위 코드
          jobTitleCode: ['', [FormValidator.required]],       // 직책 코드
        }),
      }),
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail && this.userDetailForm) {
      this.useRemove = true;
      this.roles = this.authService.roleList.value;
      this.defaultRoles = this.roles.filter(x => x.roleId === 'ROLE_EMPLOYEE').map(x => x.roleId);

      if (isObjectEmpty(changes.userDetail.currentValue)) {
        this.useRemove = false;
        this.userDetailForm.reset({
          userActiveYn: this.defaultUserActiveYn,
          roles: this.defaultRoles,
          employee: {
            workHistory: {
              jobTitleCode: '0098', // 직책 기본값 - 팀원
            },
          },
        });
        this.userDetailForm.get('userPassword').setValidators([
          FormValidator.required,
          FormValidator.maxLength(12)
        ]);
        this.userDetailForm.get('userPassword').updateValueAndValidity();
        return;
      }

      this.userDetailForm.get('userPassword').clearValidators();
      this.userDetailForm.get('userPassword').patchValue(null);
      this.userDetailForm.get('userPassword').updateValueAndValidity();

      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail?.roles?.map(x => x.roleId) || this.defaultRoles,
        employee: {
          ...this.userDetail?.employee,
          workHistory: this.userDetail?.employee?.workHistories[0],
        },
      });
    }
  }

  /** 사용자 활성화 여부를 수정한다. */
  async updateUserActiveYn(event: Event, userActiveYn: string): Promise<void> {
    const activeStatus = `${userActiveYn === 'Y' ? '활성화' : '비활성화'}`;
    const confirm = await this.messageService.confirm1(`사용자를 ${activeStatus}하시겠습니까?`);
    if (!confirm) return;

    this.authService.updateUser$({ userId: this.userDetail?.userId, userActiveYn })
    .subscribe((data) => {
      this.messageService.toastSuccess(`정상적으로 ${activeStatus}되었습니다.`);

      this.userDetail = data;
      this.userDetailForm.patchValue({
        ...this.userDetailForm.value,
        ...this.userDetail,
        roles: this.userDetail?.roles?.map((x: UserRoleResponseDTO) => x.roleId),
      });
      this.refresh.emit();
    });
  }

  /** 사용자 정보를 추가/수정한다. */
  async onSubmit(value: SaveUserRequestDTO): Promise<void> {
    const crudName = isEmpty(value.userId) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`사용자 및 직원 정보를 ${crudName}하시겠습니까?`);
    if (!confirm) return;

    // 사용자 ID가 없으면 추가 API를 타고
    if (isEmpty(value.userId)) {
      this.authService.addUser$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.authService.updateUser$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었습니다.`);
        this.refresh.emit();
      });
    }
  }

  /** 사용자를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('사용자를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.authService.removeUser$(this.userDetail.userId)
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
