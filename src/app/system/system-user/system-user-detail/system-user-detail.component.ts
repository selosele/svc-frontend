import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidator, UiButtonComponent, UiCheckboxComponent, UiCheckboxGroupComponent, UiDropdownComponent, UiTextFieldComponent } from '@app/shared/components';
import { RoleResponseDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { DepartmentResponseDTO } from '@app/human/human.model';
import { isEmpty, isObjectEmpty, isNotObjectEmpty } from '@app/shared/utils';
import { UiMessageService } from '@app/shared/services';
import { DropdownData } from '@app/shared/models';
import { CodeService } from '@app/code/code.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiCheckboxComponent,
    UiCheckboxGroupComponent,
    UiDropdownComponent,
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
  ) {}

  /** 사용자 상세 정보 */
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

  /** input readonly 여부 */
  get isReadonly(): boolean {
    return isNotObjectEmpty(this.userDetail);
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({

      // 사용자 상세 정보
      userId: [''],                                         // 사용자 ID
      userAccount: ['', [FormValidator.required]],          // 사용자 계정
      userActiveYn: ['', [FormValidator.required]],         // 사용자 활성화 여부
      roles: ['', [FormValidator.required]],                // 사용자 권한

      // 직원 정보
      employee: this.fb.group({
        employeeId: ['', [FormValidator.required]],         // 직원 ID
        employeeName: ['', [FormValidator.required]],       // 직원 명
        genderCode: ['', [FormValidator.required]],         // 성별 코드

        // 직원 회사 정보
        employeeCompany: this.fb.group({
          companyId: ['', [FormValidator.required]],          // 회사 ID
          corporateName: ['', [FormValidator.required]],      // 법인 명
          companyName: ['', [FormValidator.required]],        // 회사 명
        }),

        // 직원 부서 목록
        departments: this.fb.group({
          departmentName: ['', [FormValidator.required]],     // 부서 명
          rankCodeName: ['', [FormValidator.required]],       // 직급 명
        }),
      }),
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail && this.userDetailForm) {
      this.roles = this.authService.roleListSubject.value;
      this.defaultRoles = this.roles.filter(x => x.roleId === 'ROLE_EMPLOYEE').map(x => x.roleId);

      if (isObjectEmpty(changes.userDetail.currentValue)) {
        this.userDetailForm.reset({
          userActiveYn: this.defaultUserActiveYn,
          roles: this.defaultRoles,
        });
        return;
      }
      
      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail?.roles?.map((x: UserRoleResponseDTO) => x.roleId) || this.defaultRoles,
        employee: {
          ...this.userDetail?.employee,
          employeeCompany: this.userDetail?.employee?.employeeCompanies[0],
          departments: {
            ...this.userDetail?.employee?.departments,
            departmentName: this.findDepartmentName(this.userDetail?.employee?.departments),
            rankCodeName: this.userDetail?.employee?.departments[0].rankCodeName,
          },
        },
      });
    }
  }

  /** 부서 목록에서 모든 부서 명을 연결해서 반환한다. */
  findDepartmentName(departments: DepartmentResponseDTO[]): string {
    if (isEmpty(departments)) return '';
    return departments.map(x => x.departmentName).join(' > ');
  }

  /** 사용자 활성화 여부를 수정한다. */
  async updateUserActiveYn(event: Event, userActiveYn: string): Promise<void> {
    const activeStatus = `${userActiveYn === 'Y' ? '활성화' : '비활성화'}`;
    const confirm = await this.messageService.confirm1(event, `사용자를 ${activeStatus}하시겠습니까?`);
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

  /** 사용자 상세 정보를 저장한다. */
  onSubmit(): void {
    
  }

}
