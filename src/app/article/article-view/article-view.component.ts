import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ArticleResultDTO } from '../article.model';
import { BoardResponseDTO } from '@app/board/board.model';
import { ArticleService } from '../article.service';
import { AuthService } from '@app/auth/auth.service';
import { UiMessageService } from '@app/shared/services';
import { UiButtonComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
  ],
  selector: 'modal-article-view',
  templateUrl: './article-view.component.html',
  styleUrl: './article-view.component.scss'
})
export class ArticleViewComponent {

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private authService: AuthService,
    private articleService: ArticleService,
  ) {}

  /** 게시판 */
  get board(): BoardResponseDTO {
    return this.config.data['board'];
  }

  /** 게시글 */
  get article(): ArticleResultDTO {
    return this.config.data['article'];
  }

  /** 게시글 작성자명 */
  get articleWriterName(): string {
    return this.articleService.getArticleWriterName(this.article);
  }

  /** 인증된 사용자 정보 */
  get user() {
    return this.authService.getAuthenticatedUser();
  }

  /** 시스템관리자 권한 여부 */
  get isSystemAdmin() {
    return this.authService.hasRole('ROLE_SYSTEM_ADMIN');
  }

  /** 게시글을 삭제한다. */
  async removeArticle(articleId: number) {
    const confirm = await this.messageService.confirm2('게시글을 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.articleService.removeArticle$(articleId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.dialogRef.close(true);
    });
  }

}
