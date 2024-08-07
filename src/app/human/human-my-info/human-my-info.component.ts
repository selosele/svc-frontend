import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticatedUser, UpdateUserPasswordRequestDTO } from '@app/auth/auth.model';
import { DropdownData } from '@app/shared/models';
import { AuthService } from '@app/auth/auth.service';
import { CodeService } from '@app/code/code.service';
import { UiDialogService, UiMessageService } from '@app/shared/services';
import { isEmpty } from '@app/shared/utils';
import { HumanService } from '../human.service';
import { EmployeeResponseDTO, UpdateEmployeeRequestDTO } from '../human.model';
import { UiButtonComponent, UiSkeletonComponent } from '@app/shared/components/ui';
import { FormValidator, UiDateFieldComponent, UiDropdownComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiFormComponent,
    UiButtonComponent,
    UiTextFieldComponent,
    UiDateFieldComponent,
    UiDropdownComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'modal-human-my-info',
  templateUrl: './human-my-info.component.html',
  styleUrl: './human-my-info.component.scss'
})
export class HumanMyInfoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private dialogService: UiDialogService,
    private authService: AuthService,
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 직원 정보 데이터 로드 완료 여부 */
  get employeeDataLoad(): boolean {
    return this.humanService.employeeDataLoad.value;
  }
  
  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 비밀번호 변경 폼 */
  changePasswordForm: FormGroup;

  /** 직원 정보 폼 */
  employeeForm: FormGroup;

  /** 성별 코드 데이터 목록 */
  genderCodes: DropdownData[] = this.codeService.getDropdownData('GENDER_00');

  /** 직급 코드 데이터 목록 */
  rankCodes: DropdownData[] = this.codeService.getDropdownData('RANK_00');

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[] = this.codeService.getDropdownData('JOB_TITLE_00');

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
    this.initForm();

    if (isEmpty(this.humanService.employee.value)) {
      this.getEmployee();
    }
    this.setMyInfoForm();
  }

  /** 비밀번호를 변경한다. */
  async onSubmitPassword(value: UpdateUserPasswordRequestDTO): Promise<void> {
    const { newPassword, newPasswordConfirm } = value;

    if (newPassword !== newPasswordConfirm) {
      this.messageService.toastError('새 비밀번호를 확인하세요.');
      return;
    }

    const confirm = await this.messageService.confirm1('비밀번호를 변경하시겠습니까?');
    if (!confirm) return;

    this.authService.updatePassword(value)
    .subscribe((data) => {
      const alert = this.dialogService.alert('정상적으로 변경되었습니다.<br>다시 로그인해주시기 바랍니다.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 직원 정보를 저장한다. */
  async onSubmitEmployee(value: UpdateEmployeeRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('저장하시겠습니까?');
    if (!confirm) return;

    this.humanService.updateEmployee(value)
    .subscribe((data) => {
      const alert = this.dialogService.alert('정상적으로 변경되었습니다.<br>다시 로그인해주시기 바랍니다.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 새로고침 버튼을 클릭한다. */
  onRefresh(event: Event): void {
    this.getEmployee();
  }

  /** 직원을 조회한다. */
  private getEmployee(): void {
    this.humanService.getEmployee(this.user.employeeId);
    this.setMyInfoForm();
  }

  /** 폼을 초기화한다. */
  private initForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [FormValidator.required, FormValidator.maxLength(12)]],       // 현재 비밀번호
      newPassword: ['', [FormValidator.required, FormValidator.maxLength(12)]],           // 변경할 비밀번호
      newPasswordConfirm: ['', [FormValidator.required, FormValidator.maxLength(12)]]     // 변경할 비밀번호 확인
    });

    this.employeeForm = this.fb.group({

      // 직원 정보
      employeeId: ['', [FormValidator.required]],         // 직원 ID
      employeeName: ['', [                                // 직원명
        FormValidator.required,
        FormValidator.maxLength(30),
      ]],
      genderCode: ['', [FormValidator.required]],         // 성별 코드
      birthYmd: ['', [FormValidator.required]],           // 생년월일
      phoneNumber: ['', [FormValidator.required]],        // 휴대폰번호

      // 직원 회사 정보
      employeeCompany: this.fb.group({
        companyId: ['', [FormValidator.required]],        // 회사 ID
        corporateName: ['', [FormValidator.required]],    // 법인명
        companyName: ['', [FormValidator.required]],      // 회사명
        joinYmd: ['', [FormValidator.required]],          // 입사일자
      }),

      // 직원 부서 목록
      departments: this.fb.group({
        departmentName: ['', [FormValidator.required]],   // 부서명
        rankCode: ['', [FormValidator.required]],         // 직급 코드
        jobTitleCode: ['', [FormValidator.required]],     // 직책 코드
      }),
    });
  }

  /** 직원 정보 폼을 설정한다. */
  private setMyInfoForm(): void {
    this.humanService.employee$.subscribe(employee => {
      this.setMyInfoFormData(employee);
    });
  }

  /** 직원 정보 폼 데이터를 설정한다. */
  private setMyInfoFormData(employee: EmployeeResponseDTO): void {
    this.employeeForm.patchValue({
      ...employee,
      employeeCompany: employee?.employeeCompanies[0],
      departments: {
        ...employee?.departments[0],
        departmentName: this.humanService.findDepartmentName(employee?.departments),
      },
    });
  }

}
