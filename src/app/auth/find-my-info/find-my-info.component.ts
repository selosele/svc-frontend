import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CoreBaseComponent } from '@app/shared/components/core';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiTextFieldComponent } from '@app/shared/components/form/ui-text-field/ui-text-field.component';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { FindUserInfoRequestDTO, GetUserCertHistoryRequestDTO, UserCertHistoryResultDTO } from '../auth.model';
import { UiMessageService } from '@app/shared/services';
import { AuthStore } from '../auth.store';
import { dateUtil } from '@app/shared/utils';

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
export class FindMyInfoComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authStore: AuthStore,
    private messageService: UiMessageService,
  ) {
    super();
  }

  /** 아이디 찾기 form */
  findAccountForm: FormGroup;

  /** 비밀번호 찾기 form */
  findPasswordForm: FormGroup;

  /** 인증코드 label */
  certCodeLabel = '인증코드';

  /** 인증코드 timer */
  timer = null;

  /** 사용자 본인인증 이력 */
  get userCertHistory() {
    return this.authStore.select<UserCertHistoryResultDTO>('userCertHistory').value;
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

  /** 아이디 찾기 form을 전송한다. */
  onSubmitFindAccount(value: FindUserInfoRequestDTO): void {
    this.authService.findUserAccount$(value)
    .subscribe(() => {
      this.messageService.toastSuccess('아이디를 메일로 발송했어요. 메일을 확인해주세요.');
    });
  }

  /** 비밀번호 찾기 form을 전송한다. */
  onSubmitFindPassword(value: FindUserInfoRequestDTO): void {

    // 1. 인증코드 발송
    if (this.userCertHistory === null) {
      this.authService.findUserPassword1$(value)
      .subscribe((response) => {
        this.timer && clearInterval(this.timer);
  
        let remainingSeconds = Number(response.userCertHistory.validTime);
        let formattedTime$ = new BehaviorSubject<string>(dateUtil.duration(remainingSeconds, 'seconds').format('mm:ss'));
  
        this.timer = setInterval(() => {
          if (remainingSeconds > 0) {
            remainingSeconds--;
            formattedTime$.next(dateUtil.duration(remainingSeconds, 'seconds').format('mm:ss'));
          } else {
            clearInterval(this.timer);
          }
        }, 1000);
  
        formattedTime$.subscribe((time) => {
          this.certCodeLabel = `인증코드(${time})`;
        });
        this.authStore.update('userCertHistory', response.userCertHistory);
        this.messageService.toastSuccess('인증코드를 메일로 발송했어요. 메일을 확인해주세요.');
      });
    }
    // 2. 임시 비밀번호 발급
    else {
      this.authService.findUserPassword2$(this.findPasswordForm.value as GetUserCertHistoryRequestDTO)
      .subscribe(() => {
        this.messageService.toastSuccess('임시 비밀번호를 메일로 발송했어요. 메일을 확인해주세요.');
      });
    }
  }

}
