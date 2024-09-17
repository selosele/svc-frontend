import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormValidator, UiCheckboxComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent } from '@app/shared/components/ui';
import { UiDialogService } from '@app/shared/services';
import { isNotBlank } from '@app/shared/utils';
import { AuthService } from '../auth.service';
import { LoginRequestDTO } from '../auth.model';
import { FindMyInfoComponent } from '../find-my-info/find-my-info.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiFormComponent,
    UiButtonComponent,
    UiTextFieldComponent,
    UiCheckboxComponent,
  ],
  selector: 'view-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dialogService: UiDialogService,
    private authService: AuthService,
  ) {}

  /** 로그인 폼 */
  loginForm: FormGroup;

  /** 로컬스토리지에 저장된 사용자 계정 */
  savedUserAccount: string;
    
  ngOnInit() {
    this.loginForm = this.fb.group({
      userAccount:  ['', [FormValidator.required]], // 사용자 계정
      userPassword: ['', [                          // 사용자 비밀번호
        FormValidator.required,
        FormValidator.maxLength(12)
      ]],
      saveUserAccountYn: [''],                      // 아이디 저장 여부
    });

    // 아이디 저장 여부 값에 따른 설정
    this.savedUserAccount = this.authService.getSavedUserAccount();
    if (isNotBlank(this.savedUserAccount)) {
      this.loginForm.patchValue({
        userAccount: this.savedUserAccount,
        saveUserAccountYn: ['Y'],
      });
    }
  }
  
  /** 로그인을 한다. */
  onSubmit(value: LoginRequestDTO): void {
    this.authService.login(value);
  }

  /** 아이디/비밀번호 찾기 Modal을 표출한다. */
  showFindMyInfoModal(event: Event): void {
    this.dialogService.open(FindMyInfoComponent, {
      focusOnShow: false,
      header: '아이디/비밀번호 찾기',
    });
  }
  
}
