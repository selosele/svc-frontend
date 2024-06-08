import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth.service';
import { SignInRequestDTO } from '../auth.dto';
import { BlockButtonDirective } from '@app/shared/directives';
import { UiTextFieldComponent } from '@app/shared/components/form';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    BlockButtonDirective,
    UiTextFieldComponent,
  ],
  selector: 'view-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  /** 로그인 폼 */
  signInForm: FormGroup;
    
  ngOnInit(): void {
    this.signInForm = this.fb.group({
      userAccount:  ['', [Validators.required]], // 사용자 계정
      userPassword: ['', [Validators.required]], // 사용자 비밀번호
    });
  }
  
  /** 로그인을 한다. */
  onSubmit(): void {
    this.authService.signIn(this.signInForm.value as SignInRequestDTO);
  }
  
}
