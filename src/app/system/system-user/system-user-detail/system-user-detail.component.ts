import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiTextFieldComponent } from '@app/shared/components';
import { RoleResponseDTO, UserResponseDTO, UserRoleResponseDTO } from '@app/auth/auth.dto';
import { AuthService } from '@app/auth/auth.service';

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
      userId: ['', [FormValidator.required]],       // 사용자 ID
      userAccount: ['', [FormValidator.required]],  // 사용자 계정
      userName: ['', [FormValidator.required]],     // 사용자 명
      userActiveYn: ['', [FormValidator.required]], // 사용자 활성화 여부
      roles: [[], [FormValidator.required]],        // 사용자 권한
    });
    this.authService.listRole();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userDetail && this.userDetailForm) {
      this.userDetailForm.patchValue({
        ...this.userDetail,
        roles: this.userDetail.roles.map((x: UserRoleResponseDTO) => x.roleId)
      });
      this.roles = this.authService.roleListSubject.value;
    }
  }

  /** 사용자 정보를 저장한다. */
  onSubmit(): void {
    
  }

}
