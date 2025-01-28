import { Component, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreBaseComponent } from '@app/shared/components/core';
import { ArticleResultDTO } from '../article.model';
import { ArticleService } from '../article.service';
import { BoardResponseDTO } from '@app/board/board.model';
import { UiMessageService } from '@app/shared/services';
import { UiButtonComponent } from '@app/shared/components/ui';
import { isEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
  ],
  selector: 'modal-article-view',
  templateUrl: './article-view.component.html',
  styleUrl: './article-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArticleViewComponent extends CoreBaseComponent {

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: UiMessageService,
    private articleService: ArticleService,
  ) {
    super();
  }

  /** 게시판 */
  get board(): BoardResponseDTO {
    return this.config.data['board'];
  }

  /** 게시글 */
  get article(): ArticleResultDTO {
    return this.config.data['article'];
  }

  /** 이전/다음 게시글 목록 */
  get articleList(): ArticleResultDTO[] {
    return this.config.data['articleList'];
  }

  /** 이전 게시글 */
  get prevArticle() {
    return this.articleList?.find(x => x.prevNextFlag === 'PREV');
  }

  /** 다음 게시글 */
  get nextArticle() {
    return this.articleList?.find(x => x.prevNextFlag === 'NEXT');
  }

  /** 게시글 작성자명 */
  get articleWriterName() {
    return this.articleService.getArticleWriterName(this.article);
  }

  /** 이전/다음 게시글로 이동한다. */
  goPrevNextArticle(articleId: number): void {
    if (isEmpty(articleId)) {
      return;
    }
    this.dialogRef.close({ action: 'reload', data: { articleId } });
  }

  /** 게시글 수정 modal을 표출한다. */
  updateArticle(article: ArticleResultDTO): void {
    this.dialogRef.close({ action: 'update', data: article });
  }

  /** 게시글을 삭제한다. */
  async removeArticle(articleId: number) {
    const confirm = await this.messageService.confirm2('게시글을 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.articleService.removeArticle$(articleId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.dialogRef.close({ action: 'save' });
    });
  }

}
