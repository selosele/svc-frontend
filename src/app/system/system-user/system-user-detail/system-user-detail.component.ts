import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleResponseDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiDateFieldComponent, UiDropdownComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent } from '@app/shared/components/ui';
import { isObjectEmpty, isNotObjectEmpty } from '@app/shared/utils';
import { UiMessageService } from '@app/shared/services';
import { DropdownData } from '@app/shared/models';
import { CodeService } from '@app/code/code.service';
import { HumanService } from '@app/human/human.service';

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
    UiButtonComponent,
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
    private humanService: HumanService,
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

  /** 직급 코드 데이터 목록 */
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
        employeeId: ['', [FormValidator.required]],           // 직원 ID
        employeeName: ['', [                                  // 직원명
          FormValidator.required,
          FormValidator.maxLength(30),
        ]],
        genderCode: ['', [FormValidator.required]],           // 성별 코드
        birthYmd: ['', [FormValidator.required]],             // 생년월일
        phoneNumber: ['', [FormValidator.required]],          // 휴대폰번호

        // 직원 회사 정보
        employeeCompany: this.fb.group({
          companyId: ['', [FormValidator.required]],          // 회사 ID
          corporateName: ['', [FormValidator.required]],      // 법인명
          companyName: ['', [FormValidator.required]],        // 회사명
          joinYmd: ['', [FormValidator.required]],            // 입사일자
          quitYmd: [''],                                      // 퇴사일자
        }),

        // 직원 부서 목록
        departments: this.fb.group({
          departmentName: ['', [FormValidator.required]],     // 부서명
          rankCode: ['', [FormValidator.required]],           // 직급 코드
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
        });
        this.userDetailForm.get('userPassword').setValidators([
          FormValidator.required,
          FormValidator.maxLength(12)
        ]);
        this.userDetailForm.get('userPassword').updateValueAndValidity();
        return;
      }

      this.userDetailForm.get('userPassword').clearValidators();
      this.userDetailForm.get('userPassword').updateValueAndValidity();
      
      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail?.roles?.map((x: UserRoleResponseDTO) => x.roleId) || this.defaultRoles,
        employee: {
          ...this.userDetail?.employee,
          employeeCompany: this.userDetail?.employee?.employeeCompanies[0],
          departments: {
            ...this.userDetail?.employee?.departments[0],
            departmentName: this.humanService.findDepartmentName(this.userDetail?.employee?.departments),
          },
        },
      });
    }
  }

  /** 사용자 활성화 여부를 수정한다. */
  async updateUserActiveYn(event: Event, userActiveYn: string): Promise<void> {
    const activeStatus = `${userActiveYn === 'Y' ? '활성화' : '비활성화'}`;
    const confirm = await this.messageService.confirm1(`사용자를 ${activeStatus}하시겠습니까?`);
    if (!confirm) return;

    this.authService.updateUser({ userId: this.userDetail?.userId, userActiveYn })
    .subscribe((data) => {
      this.messageService.toastSuccess('저장되었습니다.');

      this.userDetail = data;
      this.userDetailForm.patchValue({
        ...this.userDetailForm.value,
        ...this.userDetail,
        roles: this.userDetail?.roles?.map((x: UserRoleResponseDTO) => x.roleId),
      });
      this.refresh.emit();
    });
  }

  /** 사용자 정보를 저장한다. */
  async onSubmit(value: any): Promise<void> {
    console.log(value);

    const confirm = await this.messageService.confirm1('사용자 정보를 저장하시겠습니까?');
    if (!confirm) return;

    
  }

  /** 사용자를 삭제한다. */
  async removeUser(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('선택한 사용자를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.authService.removeUser(this.userDetail.userId)
    .subscribe(() => {
      this.messageService.toastSuccess('삭제되었습니다.');
      this.remove.emit();
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
