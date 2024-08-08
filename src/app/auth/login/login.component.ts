import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginRequestDTO } from '../auth.model';
import { FormValidator, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
    UiButtonComponent,
    UiTextFieldComponent,
  ],
  selector: 'view-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  /** 로그인 폼 */
  loginForm: FormGroup;
    
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userAccount:  ['', [FormValidator.required]], // 사용자 계정
      userPassword: ['', [                          // 사용자 비밀번호
        FormValidator.required,
        FormValidator.maxLength(12)
      ]],
    });
  }
  
  /** 로그인을 한다. */
  onSubmit(value: LoginRequestDTO): void {
    this.authService.login(value);
  }
  
}
