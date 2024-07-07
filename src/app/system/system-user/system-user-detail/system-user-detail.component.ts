import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormValidator, UiDropdownComponent, UiTextFieldComponent } from '@app/shared/components';
import { UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.dto';
import { DropdownData } from '@app/shared/models';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiTextFieldComponent,
    UiDropdownComponent,
  ],
  selector: 'system-user-detail',
  templateUrl: './system-user-detail.component.html',
  styleUrl: './system-user-detail.component.scss'
})
export class SystemUserDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
  ) {}

  /** 사용자 상세 정보 */
  @Input() userDetail: UserResponseDTO = null;

  /** 사용자 상세 조회 폼 */
  userDetailForm: FormGroup;

  /** 사용자 권한 드롭다운 데이터 */
  userRoleDropdownData: DropdownData[];

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({
      userId: ['', [FormValidator.required]],       // 사용자 ID
      userAccount: ['', [FormValidator.required]],  // 사용자 계정
      userName: ['', [FormValidator.required]],     // 사용자 명
      userActiveYn: ['', [FormValidator.required]], // 사용자 활성화 여부
      roles: [[], [FormValidator.required]],        // 사용자 활성화 여부
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail && this.userDetailForm) {
      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail.roles.map((x: UserRoleResponseDTO) => x.roleName)
      });
      this.userRoleDropdownData = this.userDetail.roles.map((x: UserRoleResponseDTO) => {
        return {
          label: x.roleName,
          value: x.roleId,
        };
      });
    }
  }

  /** 사용자 정보를 저장한다. */
  onSubmit(): void {
    
  }

}
