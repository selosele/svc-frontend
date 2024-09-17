import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiTextFieldComponent } from '@app/shared/components/form/ui-text-field/ui-text-field.component';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { FindUserInfoRequestDTO, GetUserCertHistoryRequestDTO, UserCertHistoryResponseDTO } from '../auth.model';
import { AuthService } from '../auth.service';
import { StoreService, UiMessageService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    UiContentTitleComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'modal-find-my-info',
  templateUrl: './find-my-info.component.html',
  styleUrl: './find-my-info.component.scss'
})
export class FindMyInfoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private messageService: UiMessageService,
    private authService: AuthService,
  ) {}

  /** 아이디 찾기 폼 */
  findAccountForm: FormGroup;

  /** 비밀번호 찾기 폼 */
  findPasswordForm: FormGroup;

  /** 사용자 본인인증 내역 */
  get userCertHistory() {
    return this.store.select<UserCertHistoryResponseDTO>('userCertHistory').value;
  }

  ngOnInit() {
    this.findAccountForm = this.fb.group({
      employeeName: ['', [FormValidator.required]], // 실명
      emailAddr: ['', [                             // 이메일주소
        FormValidator.required,
        FormValidator.email,
      ]],
    });

    this.findPasswordForm = this.fb.group({
      userAccount: ['', [FormValidator.required]],  // 사용자 계정
      emailAddr: ['', [                             // 이메일주소
        FormValidator.required,
        FormValidator.email,
      ]],
      certCode: [''],                               // 본인인증 코드
    });
  }

  /** 아이디 찾기 폼을 전송한다. */
  onSubmitFindAccount(value: FindUserInfoRequestDTO): void {
    this.authService.findUserAccount$(value)
    .subscribe(() => {
      this.messageService.toastSuccess('메일 발송에 성공했습니다. 메일을 확인해주세요.');
    });
  }

  /** 비밀번호 찾기 폼을 전송한다. */
  onSubmitFindPassword(value: FindUserInfoRequestDTO): void {
    this.authService.findUserPassword$(value)
    .subscribe((data) => {
      this.store.update<UserCertHistoryResponseDTO>('userCertHistory', data);
      this.messageService.toastSuccess('메일 발송에 성공했습니다. 메일을 확인해주세요.');
    });
  }

  /** 사용자 본인인증 내역이 존재하는지 확인한다. */
  countUserCertHistory(): void {
    this.authService.countUserCertHistory$(this.findPasswordForm.value as GetUserCertHistoryRequestDTO)
    .subscribe((data) => {
      if (data === 0) {
        this.messageService.toastError('인증코드가 틀렸거나 유효시간이 만료되었습니다.');
        return;
      }
      
      // TODO: 임시 비밀번호 발급 로직 개발
      
    });
  }

}
