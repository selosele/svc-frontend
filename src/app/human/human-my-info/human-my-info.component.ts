import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { UpdateUserPasswordRequestDTO } from '@app/user/user.model';
import { AuthService } from '@app/auth/auth.service';
import { UserService } from '@app/user/user.service';
import { StoreService, UiMessageService } from '@app/shared/services';
import { isEmpty, roles } from '@app/shared/utils';
import { HumanService } from '../human.service';
import { WorkHistoryResponseDTO, EmployeeResponseDTO, SaveEmployeeRequestDTO, CompanyApplyResponseDTO } from '../human.model';
import { UiButtonComponent, UiContentTitleComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiTextFieldComponent } from '@app/shared/components/form/ui-text-field/ui-text-field.component';
import { UiDateFieldComponent } from '@app/shared/components/form/ui-date-field/ui-date-field.component';
import { UiDropdownComponent } from '@app/shared/components/form/ui-dropdown/ui-dropdown.component';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { HumanMyInfoCompanyDetailComponent } from './human-my-info-company-detail/human-my-info-company-detail.component';
import { HumanMyInfoCompanyApplyDetailComponent } from './human-my-info-company-apply-detail/human-my-info-company-apply-detail.component';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
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
    HumanMyInfoCompanyDetailComponent,
    HumanMyInfoCompanyApplyDetailComponent,
],
  selector: 'view-human-my-info',
  templateUrl: './human-my-info.component.html',
  styleUrl: './human-my-info.component.scss'
})
export class HumanMyInfoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: StoreService,
    private messageService: UiMessageService,
    private authService: AuthService,
    private userSerivce: UserService,
    private humanService: HumanService,
  ) {}

  /** table - 근무이력정보 */
  @ViewChild('table1') table1: UiTableComponent;

  /** splitter - 근무이력정보 */
  @ViewChild('splitter1') splitter1: UiSplitterComponent;

  /** table - 회사등록신청현황 */
  @ViewChild('table2') table2: UiTableComponent;

  /** splitter - 회사등록신청현황 */
  @ViewChild('splitter2') splitter2: UiSplitterComponent;

  /** 직원 정보 데이터 로드 완료 여부 */
  get employeeDataLoad() {
    return this.store.select<boolean>('employeeDataLoad').value;
  }

  /** 근무이력 목록 */
  get workHistoryList(): WorkHistoryResponseDTO[] {
    const employee = this.store.select<EmployeeResponseDTO>('employee').value;
    return employee.workHistories;
  }

  /** 회사등록신청 목록 */
  get companyApplyList(): CompanyApplyResponseDTO[] {
    return this.store.select<CompanyApplyResponseDTO[]>('companyApplyList').value
  }
  
  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 인증된 사용자가 시스템관리자 권한을 보유했는지 여부 */
  isSystemAdmin: boolean;

  /** 비밀번호 변경 폼 */
  changePasswordForm: FormGroup;

  /** 직원 정보 폼 */
  employeeForm: FormGroup;

  /** 성별 코드 데이터 목록 */
  genderCodes: DropdownData[];

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[];

  /** 직책 코드 데이터 목록 */
  jobTitleCodes: DropdownData[];

  /** 근무이력정보 테이블 컬럼 */
  cols1 = [
    { field: 'companyName', header: '회사명' },
    { field: 'joinYmd',     header: '입사일자' },
    { field: 'quitYmd',     header: '퇴사일자' },
    { header: '재직기간',
      valueGetter: (data: WorkHistoryResponseDTO) => {
        if (data.workDiffY === 0) return `${data.workDiffM}개월`;
        if (data.workDiffM === 0) return `${data.workDiffY}년`;
        
        return `${data.workDiffY}년 ${data.workDiffM}개월`;
      }
    },
  ];

  /** 근무이력정보 */
  workHistoryDetail: WorkHistoryResponseDTO = null;

  /** 근무이력정보 테이블 선택된 행 */
  selection1: WorkHistoryResponseDTO;

  /** 회사등록신청현황 테이블 컬럼 */
  cols2 = [
    { field: 'companyName',        header: '회사명' },
    { field: 'corporateName',      header: '법인명' },
    { field: 'registrationNo',     header: '사업자등록번호' },
    { field: 'applyContent',       header: '내용' },
    { field: 'applyDt',            header: '신청일시' },
    { field: 'applyStateCodeName', header: '신청상태',
      valueGetter: (data: CompanyApplyResponseDTO) => {
        const colorClass = this.getColorClass(data.applyStateCode);
        return `<span class="px-3 py-1 ${colorClass}">${data.applyStateCodeName}</span>`;
      }
    },
  ];

  /** 회사등록신청 정보 */
  companyApplyDetail: CompanyApplyResponseDTO = null;

  /** 회사등록신청현황 테이블 선택된 행 */
  selection2: CompanyApplyResponseDTO;

  ngOnInit() {
    this.route.data.subscribe(({ code }) => {
      this.genderCodes = code['GENDER_00'];
      this.rankCodes = code['RANK_00'];
      this.jobTitleCodes = code['JOB_TITLE_00'];
    });

    this.user = this.authService.getAuthenticatedUser();
    this.isSystemAdmin = this.authService.hasRole(roles.SYSTEM_ADMIN);
    this.initForm();

    if (isEmpty(this.store.select<EmployeeResponseDTO>('employee').value)) {
      this.getEmployee();
    }
    this.setMyInfoForm();
    this.listCompanyApply();
  }

  /** 직원을 조회한다. */
  getEmployee(): void {
    this.humanService.getEmployee(this.user?.employeeId);
    this.setMyInfoForm();
  }

  /** 비밀번호를 변경한다. */
  async onSubmitPassword(value: UpdateUserPasswordRequestDTO): Promise<void> {
    const { newPassword, newPasswordConfirm } = value;

    if (newPassword !== newPasswordConfirm) {
      this.messageService.toastError('새 비밀번호를 확인하세요.');
      return;
    }

    const confirm = await this.messageService.confirm1('비밀번호를 변경하시겠어요?');
    if (!confirm) return;

    this.userSerivce.updatePassword$(value)
    .subscribe(() => {
      const alert = this.messageService.alert('정상적으로 변경되었어요.<br>다시 로그인해주세요.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 직원 정보를 저장한다. */
  async onSubmitEmployee(value: SaveEmployeeRequestDTO): Promise<void> {
    const confirm = await this.messageService.confirm1('저장하시겠어요?');
    if (!confirm) return;

    this.humanService.updateEmployee$(value)
    .subscribe((data) => {
      const alert = this.messageService.alert('정상적으로 변경되었어요.<br>다시 로그인해주세요.');
      alert.onClose.subscribe((data) => {
        this.authService.logout();
      });
    });
  }

  /** 직원 정보 새로고침 버튼을 클릭한다. */
  onRefreshEmployee(event: Event): void {
    this.getEmployee();
  }

  /** 근무이력정보 추가 버튼을 클릭한다. */
  addCompany(): void {
    this.workHistoryDetail = {};
    this.splitter1.show();
  }

  /** 근무이력정보 테이블 행을 선택한다. */
  onRowSelect1(event: any): void {
    this.humanService.getWorkHistory$(this.user?.userId, event.data['workHistoryId'])
    .subscribe((data) => {
      this.workHistoryDetail = data;
      this.splitter1.show();
    });
  }

  /** 근무이력정보 테이블 행을 선택 해제한다. */
  onRowUnselect1(event: any): void {
    this.workHistoryDetail = {};
    this.splitter1.hide();
  }

  /** 근무이력정보 테이블 삭제 버튼을 클릭한다. */
  onRemove1(): void {
    this.splitter1.hide();
    this.getEmployee();
  }

  /** 근무이력정보 닫기 버튼을 클릭한다. */
  onClose1(): void {
    this.splitter1.hide();
  }

  /** 회사등록신청현황 목록을 조회한다. */
  listCompanyApply(): void {
    this.humanService.listCompanyApply();
  }

  /** 회사등록신청현황 테이블 새로고침 버튼을 클릭한다. */
  onRefresh2(): void {
    this.listCompanyApply();
  }

  /** 회사등록신청현황 테이블 행을 선택한다. */
  onRowSelect2(event: any): void {
    this.humanService.getCompanyApply$(event.data['companyApplyId'])
    .subscribe((data) => {
      this.companyApplyDetail = data;
      this.splitter2.show();
    });
  }

  /** 회사등록신청현황 테이블 행을 선택 해제한다. */
  onRowUnselect2(event: any): void {
    this.companyApplyDetail = {};
    this.splitter2.hide();
  }

  /** 회사등록신청현황 테이블 삭제 버튼을 클릭한다. */
  onRemove2(): void {
    this.splitter2.hide();
    this.listCompanyApply();
  }

  /** 회사등록신청현황 닫기 버튼을 클릭한다. */
  onClose2(): void {
    this.splitter2.hide();
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
      phoneNo: ['', [FormValidator.required]],            // 휴대폰번호
      emailAddr: ['', [                                   // 이메일주소
        FormValidator.required,
        FormValidator.email,
      ]],
      lastLoginDt: [''],                                  // 사용자 마지막 로그인 일시

      // 근무이력정보
      workHistory: this.fb.group({
        companyId: ['', [FormValidator.required]],        // 회사 ID
        corporateName: ['', [FormValidator.required]],    // 법인명
        companyName: ['', [FormValidator.required]],      // 회사명
        joinYmd: ['', [FormValidator.required]],          // 입사일자,
        rankCode: ['', [FormValidator.required]],         // 직위 코드
        jobTitleCode: ['', [FormValidator.required]],     // 직책 코드
      }),
    });
  }

  /** 직원 정보 폼을 설정한다. */
  private setMyInfoForm(): void {
    this.store.select<EmployeeResponseDTO>('employee').asObservable().subscribe((data) => {
      this.setMyInfoFormData(data);
    });
  }

  /** 직원 정보 폼 데이터를 설정한다. */
  private setMyInfoFormData(employee: EmployeeResponseDTO): void {
    this.employeeForm.patchValue({
      ...employee,
      workHistory: employee?.workHistories[0],
    });
  }

  /** 신청상태 color 클래스명을 반환한다. */
  private getColorClass(applyStateCode: string): string {

    // 신청
    if (applyStateCode === 'NEW') {
      return 'bg-primary-reverse';
    }
    // 승인
    else if (applyStateCode === 'APPROVAL') {
      return 'bg-primary text-white';
    }
    // 반려
    else if (applyStateCode === 'REJECT') {
      return 'bg-red-500 text-white';
    }

    return '';
  }

}
