import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ArticleResultDTO } from '../article.model';
import { BoardResponseDTO } from '@app/board/board.model';
import { ArticleService } from '../article.service';
import { AuthService } from '@app/auth/auth.service';
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

}
