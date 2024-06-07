import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SignInRequestDTO } from '../auth.dto';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
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
      userAccount:  ['sys', Validators.required], // 사용자 계정
      userPassword: ['sys', Validators.required], // 사용자 비밀번호
    });
  }
  
  /** 로그인을 한다. */
  onSubmit(): void { 
    this.authService.signIn(this.signInForm.value as SignInRequestDTO)
    .subscribe({
      next: (data) => {
        console.log(`accessToken: ${data.accessToken}`);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  
}
