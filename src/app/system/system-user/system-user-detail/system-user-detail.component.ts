import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticatedUser, RoleResponseDTO, SaveUserRequestDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiCompanyFieldComponent, UiDateFieldComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { isObjectEmpty, isNotObjectEmpty, isEmpty, roles } from '@app/shared/utils';
import { StoreService, UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

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
    private route: ActivatedRoute,
    private store: StoreService,
    private messageService: UiMessageService,
    private authService: AuthService,
    private codeService: CodeService,
  ) {}

  /** 사용자 정보 */
  @Input() userDetail: UserResponseDTO = null;

  /** 사용자 상세 조회 폼 */
  userDetailForm: FormGroup;

  /** 사용자 활성화 여부 데이터 목록 */
  userActiveYns = this.codeService.createYnCodeData();

  /** 사용자 활성화 여부 기본 값 */
  defaultUserActiveYn = 'Y';

  /** 모든 권한 목록 */
  roles: RoleResponseDTO[] = [];

  /** 권한 목록 기본 값 */
  defaultRoles: string[] = [];

  /** 성별 코드 데이터 목록 */
  genderCodes: DropdownData[];

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[];

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[];

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 사용자 정보가 본인의 정보와 일치하는지 여부 */
  isUserSelf = false;

  /** 사용자 정보 존재 여부 */
  get isUserNotEmpty() {
    return isNotObjectEmpty(this.userDetail);
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();

    this.route.data.subscribe(({ code }) => {
      this.genderCodes = code['GENDER_00'];
      this.rankCodes = code['RANK_00'];
      this.jobTitleCodes = code['JOB_TITLE_00'];
    });

    this.userDetailForm = this.fb.group({

      // 사용자 정보
      userId: [''],                                           // 사용자 ID
      userAccount: ['', [                                     // 사용자 계정
        FormValidator.required,
        FormValidator.minLength(3),
        FormValidator.maxLength(20),
      ]],
      userPassword: ['', [                                    // 사용자 비밀번호
        FormValidator.required,
        FormValidator.maxLength(12)
      ]],
      userActiveYn: ['', [FormValidator.required]],           // 사용자 활성화 여부
      lastLoginDt: [''],                                      // 마지막 로그인 일시
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
        emailAddr: ['', [                                     // 이메일주소
          FormValidator.required,
          FormValidator.email,
        ]],

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
      this.isUserSelf = Number(this.user.userId) === this.userDetail.userId;

      this.useRemove = !this.isUserSelf;
      this.roles = this.store.select<RoleResponseDTO[]>('roleList').value;
      this.defaultRoles = this.roles.filter(x => x.roleId === roles.EMPLOYEE).map(x => x.roleId);

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

  /** 특정 사용자로 로그인한다. */
  async superLogin(): Promise<void> {
    const confirm = await this.messageService.confirm1(`${this.userDetail.userAccount} 계정으로 로그인하시겠습니까?`);
    if (!confirm) return;

    this.authService.superLogin({
      userAccount: this.userDetail.userAccount,
      isSuperLogin: 'Y',
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
