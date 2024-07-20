import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginRequestDTO } from '../auth.model';
import { FormValidator, UiButtonComponent, UiTextFieldComponent } from '@app/shared/components';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
      userPassword: ['', [FormValidator.required]], // 사용자 비밀번호
    });
  }
  
  /** 로그인을 한다. */
  onSubmit(): void {
    this.authService.login(this.loginForm.value as LoginRequestDTO);
  }
  
}
