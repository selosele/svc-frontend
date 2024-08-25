import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticatedUser, UpdateUserPasswordRequestDTO } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { CodeService } from '@app/code/code.service';
import { UiMessageService } from '@app/shared/services';
import { dateUtil, isEmpty, isNotBlank } from '@app/shared/utils';
import { HumanService } from '../human.service';
import { EmployeeCompanyResponseDTO, EmployeeResponseDTO, SaveEmployeeRequestDTO } from '../human.model';
import { UiButtonComponent, UiContentTitleComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiTextFieldComponent } from '@app/shared/components/form/ui-text-field/ui-text-field.component';
import { UiDateFieldComponent } from '@app/shared/components/form/ui-date-field/ui-date-field.component';
import { UiDropdownComponent } from '@app/shared/components/form/ui-dropdown/ui-dropdown.component';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { HumanMyInfoCompanyDetailComponent } from './human-my-info-company-detail/human-my-info-company-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiFormComponent,
    UiButtonComponent,
    UiTextFieldComponent,
    UiDateFieldComponent,
    UiDropdownComponent,
    UiTableComponent,
    UiSplitterComponent,
    UiContentTitleComponent,
    LayoutPageDescriptionComponent,
    HumanMyInfoCompanyDetailComponent
],
  selector: 'modal-human-my-info',
  templateUrl: './human-my-info.component.html',
  styleUrl: './human-my-info.component.scss'
})
export class HumanMyInfoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private authService: AuthService,
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 직원 정보 데이터 로드 완료 여부 */
  get employeeDataLoad(): boolean {
    return this.humanService.employeeDataLoad.value;
  }

  /** 직원 회사 목록 */
  get employeeCompanyList(): EmployeeCompanyResponseDTO[] {
    return this.humanService.employee.value.employeeCompanies;
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

  /** 테이블 컬럼 */
  cols = [
    { field: 'companyName', header: '회사명' },
    { field: 'joinYmd',     header: '입사일자' },
    { field: 'quitYmd',     header: '퇴사일자' },
    { header: '재직기간',
      valueGetter: (data) => {
        let startDate = dateUtil(data.joinYmd);
        let endDate = dateUtil(dateUtil().format('YYYYMMDD'));
        
        if (isNotBlank(data.quitYmd)) {
          endDate = dateUtil(data.quitYmd);
        } else {
          endDate = dateUtil(dateUtil().format('YYYYMMDD'));
        }

        const diffInYears = endDate.diff(startDate, 'year');
        const adjustedEndDate = startDate.add(diffInYears, 'year');
        const diffInMonths = endDate.diff(adjustedEndDate, 'month');

        if (diffInYears === 0) {
          return `${diffInMonths}개월`;
        }
        return `${diffInYears}년 ${diffInMonths}개월`;
      }
    },
  ];

  /** 직원 회사 정보 */
  employeeCompanyDetail: EmployeeCompanyResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: EmployeeCompanyResponseDTO;

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
    this.initForm();

    if (isEmpty(this.humanService.employee.value)) {
      this.getEmployee();
    }
    this.setMyInfoForm();
  }

  /** 직원을 조회한다. */
  getEmployee(): void {
    this.humanService.getEmployee(this.user.employeeId);
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

    this.authService.updatePassword$(value)
    .subscribe((data) => {
      const alert = this.messageService.alert('정상적으로 변경되었습니다.<br>다시 로그인해주시기 바랍니다.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 직원 정보를 저장한다. */
  async onSubmitEmployee(value: SaveEmployeeRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('저장하시겠습니까?');
    if (!confirm) return;

    this.humanService.updateEmployee$(value)
    .subscribe((data) => {
      const alert = this.messageService.alert('정상적으로 변경되었습니다.<br>다시 로그인해주시기 바랍니다.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 직원 정보 새로고침 버튼을 클릭한다. */
  onRefreshEmployee(event: Event): void {
    this.getEmployee();
  }

  /** 근무이력 정보 새로고침 버튼을 클릭한다. */
  onRefreshEmployeeCompany(event: Event): void {
    
  }

  /** 근무이력 정보 추가 버튼을 클릭한다. */
  addCompany(): void {
    this.employeeCompanyDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.humanService.getEmployeeCompany$(this.user.userId, event.data['employeeCompanyId'])
    .subscribe((data) => {
      this.employeeCompanyDetail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.employeeCompanyDetail = {};
    this.splitter.hide();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.getEmployee();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
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
        joinYmd: ['', [FormValidator.required]],          // 입사일자,
        rankCode: ['', [FormValidator.required]],         // 직급 코드
        jobTitleCode: ['', [FormValidator.required]],     // 직책 코드
      }),
    });
  }

  /** 직원 정보 폼을 설정한다. */
  private setMyInfoForm(): void {
    this.humanService.employee$.subscribe((data) => {
      this.setMyInfoFormData(data);
    });
  }

  /** 직원 정보 폼 데이터를 설정한다. */
  private setMyInfoFormData(employee: EmployeeResponseDTO): void {
    this.employeeForm.patchValue({
      ...employee,
      employeeCompany: employee?.employeeCompanies[0],
    });
  }

}
