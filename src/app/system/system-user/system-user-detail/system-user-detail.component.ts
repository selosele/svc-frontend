import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiTextFieldComponent } from '@app/shared/components';
import { RoleResponseDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.dto';
import { AuthService } from '@app/auth/auth.service';
import { DepartmentResponseDTO } from '@app/human/human.dto';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiCheckboxComponent,
    UiCheckboxGroupComponent,
  ],
  selector: 'system-user-detail',
  templateUrl: './system-user-detail.component.html',
  styleUrl: './system-user-detail.component.scss'
})
export class SystemUserDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  /** 사용자 상세 정보 */
  @Input() userDetail: UserResponseDTO = null;

  /** 사용자 상세 조회 폼 */
  userDetailForm: FormGroup;

  /** 모든 권한 목록 */
  roles: RoleResponseDTO[] = [];

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({

      // 사용자 정보
      userId: ['', [FormValidator.required]],               // 사용자 ID
      userAccount: ['', [FormValidator.required]],          // 사용자 계정
      userName: ['', [FormValidator.required]],             // 사용자 명
      userActiveYn: ['', [FormValidator.required]],         // 사용자 활성화 여부
      roles: [[], [FormValidator.required]],                // 사용자 권한

      // 직원 정보
      employee: this.fb.group({
        employeeId: ['', [FormValidator.required]],         // 직원 ID
        employeeName: ['', [FormValidator.required]],       // 직원 명
        genderCodeName: ['', [FormValidator.required]],     // 성별 코드 명

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
    this.authService.listRole();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail && this.userDetailForm) {
      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail.roles.map((x: UserRoleResponseDTO) => x.roleId),
        employee: {
          ...this.userDetail.employee,
          employeeCompany: this.userDetail.employee.employeeCompanies[0],
          departments: {
            ...this.userDetail.employee.departments,
            departmentName: this.findDepartmentName(this.userDetail.employee.departments),
            rankCodeName: this.userDetail.employee.departments[0].rankCodeName,
          },
        },
      });
      this.roles = this.authService.roleListSubject.value;
    }
  }

  /** 부서 목록에서 모든 부서 명을 연결해서 반환한다. */
  findDepartmentName(departments: DepartmentResponseDTO[]): string {
    return departments.map(x => x.departmentName).join(' > ');
  }

  /** 사용자 정보를 저장한다. */
  onSubmit(): void {
    
  }

}
