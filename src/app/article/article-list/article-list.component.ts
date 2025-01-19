import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { StoreService, UiDialogService, UiLoadingService } from '@app/shared/services';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { ArticleDataStateDTO, ArticleResultDTO } from '../article.model';
import { ArticleService } from '../article.service';
import { AuthService } from '@app/auth/auth.service';
import { SaveArticleComponent } from '../save-article/save-article.component';
import { ArticleViewComponent } from '../article-view/article-view.component';
import { isObjectEmpty } from '@app/shared/utils';

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

    // TODO: 2025.01.19. 게시판 목록 페이지에서 로그아웃시 listArticle$()이 발행되어 404 오류 발생
    // 아래 코드도 동일한 현상이 발생함. 추후 리팩토링 예정
    // this.route.url.subscribe((urlSegments: UrlSegment[]) => {
    //   const currentUrl = urlSegments.map(segment => segment.path).join('/');
    //   if (currentUrl.includes('co/boards')) { 
    //     this.boardId = this.route.snapshot.params['boardId'];
        
    //     if (!this.articleResponseDataLoad) {
    //       this.listArticle();
    //     }
    //   }
    // });
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

    modal.onClose.subscribe((result) => {
      if (isObjectEmpty(result)) return;

      // 게시글 추가/수정/삭제
      if (result.action === 'save') {
        this.listArticle();
      }
    });
  }

  /** 게시글을 조회한다. */
  getArticle(articleId: number): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    this.articleService.getArticle$(articleId)
    .subscribe((data) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      const modal = this.dialogService.open(ArticleViewComponent, {
        focusOnShow: false,
        header: data.article.articleTitle,
        width: '1000px',
        data,
      });

      modal?.onClose.subscribe((result) => {
        if (isObjectEmpty(result)) return;

        // 게시글 추가/수정/삭제
        if (result.action === 'save') {
          this.listArticle();
        }
        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        else if (result.action === 'reload') {
          this.getArticle(result.data.articleId);
        }
      });
    });
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.getArticle(event.data['articleId']);
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listArticle();
  }

}
