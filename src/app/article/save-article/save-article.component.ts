import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreBaseComponent } from '@app/shared/components/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { FormValidator, UiCheckboxComponent, UiEditorComponent, UiFormComponent, UiHiddenFieldComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent } from '@app/shared/components/ui';
import { TransformToDto } from '@app/shared/decorators';
import { UiMessageService } from '@app/shared/services';
import { isEmpty } from '@app/shared/utils';
import { ArticleResultDTO, SaveArticleRequestDTO } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiFormComponent,
    UiCheckboxComponent,
    UiTextFieldComponent,
    UiEditorComponent,
    UiHiddenFieldComponent,
    UiButtonComponent,
  ],
  selector: 'modal-save-article',
  templateUrl: './save-article.component.html',
  styleUrl: './save-article.component.scss'
})
export class SaveArticleComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private articleService: ArticleService,
  ) {
    super();
  }

  /** 게시글 정보 */
  @Input() detail: ArticleResultDTO = null;

  /** 게시글 상세 조회 form */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 닉네임 편집 가능 여부 */
  isNicknameEditable = true;

  /** 게시글 추가/수정/삭제 등의 action */
  get action(): string {
    return this.config.data['action'];
  }

  /** 게시글 정보 */
  get article(): ArticleResultDTO {
    return this.config.data['article'];
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({
      articleId: [''],                                            // 게시글 ID
      boardId: [this.config.data['boardId']],                     // 게시판 ID
      articleTitle: ['', [                                        // 게시글 제목
        FormValidator.required,
        FormValidator.maxLength(100)
      ]],
      articleContent: ['', [                                      // 게시글 내용
        FormValidator.required,
        // FormValidator.maxLength(4000)
      ]],
      articleWriterId: [''],                                      // 게시글 작성자 ID
      articleWriterNickname: ['', [                               // 게시글 작성자 닉네임
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      useNicknameYn: [['Y']],                                     // 닉네임 사용 여부
    });

    // 게시글 수정 modal 표출
    if (this.action === this.actions.UPDATE) {
      this.detailForm.patchValue({
        ...this.article,
        useNicknameYn: this.article.articleWriterNickname ? ['Y'] : [],
        articleWriterNickname: this.articleService.getArticleWriterName(this.article, { tagUseYn: 'N' }),
      });
      
      this.detailForm.get('useNicknameYn').disable();
      this.detailForm.get('articleWriterNickname').disable();
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
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close({ action: this.actions.SAVE });
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.articleService.updateArticle$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.dialogRef.close({ action: this.actions.SAVE });
      });
    }
  }

  /** 닉네임 사용 여부 체크박스를 선택한다. */
  onUseNicknameYnChange(event: CheckboxChangeEvent): void {
    if (event.checked[0] === 'Y') {
      this.isNicknameEditable = true;
      this.detailForm.get('articleWriterNickname').patchValue('');
      this.detailForm.get('articleWriterNickname').enable();
      this.detailForm.get('articleWriterNickname').setValidators([FormValidator.required, FormValidator.maxLength(30)]);
    } else {
      this.isNicknameEditable = false;
      this.detailForm.get('articleWriterNickname').patchValue(this.user?.employeeName);
      this.detailForm.get('articleWriterNickname').disable();
      this.detailForm.get('articleWriterNickname').clearValidators();
    }

    this.detailForm.get('articleWriterNickname').updateValueAndValidity();
  }

  /** 게시글 조회 화면으로 돌아간다. */
  goToArticle(): void {
    const articleId = this.detailForm.get('articleId').value;
    this.dialogRef.close({ action: this.actions.RELOAD, data: { articleId } });
  }

}
