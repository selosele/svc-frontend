import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormValidator } from '@app/shared/components/form/form-validator/form-validator.component';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiTextFieldComponent } from '@app/shared/components/form/ui-text-field/ui-text-field.component';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiContentTitleComponent, UiTabComponent } from '@app/shared/components/ui';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { FindUserAccountRequestDTO } from '../auth.model';
import { AuthService } from '../auth.service';
import { UiMessageService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    UiTabComponent,
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
    private messageService: UiMessageService,
    private authService: AuthService,
  ) {}

  /** 탭 목록 */
  tabList: Tab[] = [
    { title: '아이디 찾기', key: 0 },
    { title: '비밀번호 찾기', key: 1 },
  ];

  /** 선택된 탭 index */
  activeIndex = 0;

  /** 아이디 찾기 폼 */
  findAccountForm: FormGroup;

  ngOnInit(): void {
    this.findAccountForm = this.fb.group({
      employeeName: ['', [FormValidator.required]], // 실명
      emailAddr: ['', [                             // 이메일주소
        FormValidator.required,
        FormValidator.email,
      ]],
    });
  }

  /** 탭을 클릭한다. */
  onActiveIndexChange(index: number): void {
    this.activeIndex = index;
  }

  /** 아이디 찾기 폼을 전송한다. */
  onSubmitFindAccount(value: FindUserAccountRequestDTO): void {
    this.authService.getUserFindAccount(value)
    .subscribe((data) => {
      if (data === 0) this.messageService.toastError('메일 발송에 실패했습니다. 다시 시도해주세요.');
      if (data === 1) this.messageService.toastSuccess('메일 발송에 성공했습니다. 메일을 확인해주세요.');
    });
  }

}
