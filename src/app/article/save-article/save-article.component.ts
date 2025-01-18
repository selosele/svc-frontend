import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { FormValidator, UiCheckboxComponent, UiEditorComponent, UiFormComponent, UiHiddenFieldComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { TransformToDto } from '@app/shared/decorators';
import { UiMessageService } from '@app/shared/services';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';
import { AuthService } from '@app/auth/auth.service';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { ArticleResultDTO, SaveArticleRequestDTO } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormComponent,
    UiCheckboxComponent,
    UiTextFieldComponent,
    UiEditorComponent,
    UiHiddenFieldComponent,
  ],
  selector: 'modal-save-article',
  templateUrl: './save-article.component.html',
  styleUrl: './save-article.component.scss'
})
export class SaveArticleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private authService: AuthService,
    private articleService: ArticleService,
  ) {}

  /** 게시글 정보 */
  @Input() detail: ArticleResultDTO = null;

  /** 게시글 상세 조회 폼 */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 닉네임 편집 가능 여부 */
  isNicknameEditable = true;

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();
    
    this.detailForm = this.fb.group({
      articleId: [''],                                            // 게시글 ID
      boardId: [this.config.data['boardId']],                     // 게시판 ID
      articleTitle: ['', [                                        // 게시글 제목
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      articleContent: ['', [                                      // 게시글 내용
        FormValidator.required,
        FormValidator.maxLength(4000)
      ]],
      articleWriterNickname: ['', [FormValidator.maxLength(30)]], // 게시글 작성자 닉네임
      useNicknameYn: [['Y']],                                     // 닉네임 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset();
        return;
      }

      this.detailForm.patchValue(this.detail);
    }
  }

  /** 게시글을 저장한다. */
  @TransformToDto(SaveArticleRequestDTO)
  async onSubmit(value: SaveArticleRequestDTO): Promise<void> {
    const crudName = isEmpty(value.articleId) ? '작성' : '수정';

    const confirm = await this.messageService.confirm1(`게시글을 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 게시글 ID가 없으면 추가 API를 타고
    if (isEmpty(value.articleId)) {
      this.articleService.addArticle$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close(true);
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.articleService.updateArticle$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close(true);
      });
    }
  }

  /** 게시글을 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('게시글을 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.articleService.removeArticle$(this.detail.articleId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.remove.emit();
    });
  }

  /** 닉네임 사용 여부 체크박스를 선택한다. */
  onUseNicknameYnChange(event: CheckboxChangeEvent): void {
    if (event.checked[0] === 'Y') {
      this.isNicknameEditable = true;
      this.detailForm.get('articleWriterNickname').patchValue('');
      this.detailForm.get('articleWriterNickname').enable();
    } else {
      this.isNicknameEditable = false;
      this.detailForm.get('articleWriterNickname').patchValue(this.user?.employeeName);
      this.detailForm.get('articleWriterNickname').disable();
    }
  }

}
