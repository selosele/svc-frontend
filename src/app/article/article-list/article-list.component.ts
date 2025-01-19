import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService, UiDialogService, UiLoadingService } from '@app/shared/services';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { ArticleDataStateDTO, ArticleResultDTO } from '../article.model';
import { ArticleService } from '../article.service';
import { AuthService } from '@app/auth/auth.service';
import { SaveArticleComponent } from '../save-article/save-article.component';
import { ArticleViewComponent } from '../article-view/article-view.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTableComponent,
    UiButtonComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-article-list',
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss'
})
export class ArticleListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private store: StoreService,
    private loadingService: UiLoadingService,
    private dialogService: UiDialogService,
    private authService: AuthService,
    private articleService: ArticleService,
  ) {}

  /** 게시글 및 게시판 정보 */
  get articleResponse() {
    const article = this.store.select<ArticleDataStateDTO>('articleResponse').value;
    return article?.[this.boardId]?.data ?? null;
  }

  /** 게시글 및 게시판 데이터 로드 완료 여부 */
  get articleResponseDataLoad() {
    const article = this.store.select<ArticleDataStateDTO>('articleResponse').value;
    return article?.[this.boardId]?.dataLoaded ?? false;
  }

  /** 인증된 사용자 정보 */
  get user() {
    return this.authService.getAuthenticatedUser();
  }

  /** 시스템관리자 권한 여부 */
  get isSystemAdmin() {
    return this.authService.hasRole('ROLE_SYSTEM_ADMIN');
  }

  /** 테이블 선택된 행 */
  selection: ArticleResultDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'articleTitle',      header: '제목',
      valueGetter: (data: ArticleResultDTO) => this.articleService.getArticleTitle(data, Number(this.user?.userId)),
    },
    { field: 'articleWriterName', header: '작성자',
      valueGetter: (data: ArticleResultDTO) => this.articleService.getArticleWriterName(data)
    },
    { field: 'createDt', header: '작성일시' },
  ];

  /** 게시판 ID */
  private boardId: number;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.boardId = params['boardId'];

      if (!this.articleResponseDataLoad) {
        this.listArticle();
      }
    });
  }

  /** 게시글 목록을 조회한다. */
  listArticle(): void {
    this.articleService.listArticle$({ boardId: this.boardId })
    .subscribe((data) => {
      const oldValue = this.store.select<ArticleDataStateDTO>('articleResponse').value;
      this.store.update('articleResponse', {
        ...oldValue,
        [this.boardId]: { data, dataLoaded: true } // 게시판 ID별로 게시글 목록을 상태관리
      });
    });
  }
  
  /** 게시글 작성 modal을 표출한다. */
  addArticle(): void {
    const modal = this.dialogService.open(SaveArticleComponent, {
      focusOnShow: false,
      header: '게시글 작성하기',
      width: '1000px',
      data: { boardId: this.boardId }
    });

    modal.onClose.subscribe((articleSaved) => {
      if (articleSaved) {
        this.listArticle();
      }
    });
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    this.articleService.getArticle$(event.data['articleId'])
    .subscribe((data) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      const modal = this.dialogService.open(ArticleViewComponent, {
        focusOnShow: false,
        header: data.article.articleTitle,
        width: '1000px',
        data,
      });

      modal.onClose.subscribe((articleSaved) => {
        if (articleSaved) {
          this.listArticle();
        }
      });
    });
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listArticle();
  }

}
