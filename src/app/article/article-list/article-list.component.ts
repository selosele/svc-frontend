import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UiDialogService, UiLoadingService } from '@app/shared/services';
import { CoreBaseComponent } from '@app/shared/components/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { isObjectEmpty } from '@app/shared/utils';
import { ArticleDataStateDTO, ArticleResultDTO } from '../article.model';
import { ArticleService } from '../article.service';
import { SaveArticleComponent } from '../save-article/save-article.component';
import { ArticleViewComponent } from '../article-view/article-view.component';
import { ArticleStore } from '../article.store';

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
export class ArticleListComponent extends CoreBaseComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleStore: ArticleStore,
    private config: DynamicDialogConfig,
    private loadingService: UiLoadingService,
    private dialogService: UiDialogService,
    private articleService: ArticleService,
  ) {
    super();
    
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    )
    .subscribe(() => {
      this.boardId = route.snapshot.params['boardId'];
  
      if (!this.articleResponseDataLoad) {
        this.articleService.listArticle(this.boardId);
      }
    });
  }

  /** 조회를 요청한 화면 */
  get from(): string {
    return this.config.data?.['from'];
  }

  /** 게시글 및 게시판 정보 */
  get articleResponse() {
    const article = this.articleStore.select<ArticleDataStateDTO>('articleResponse').value;
    return article?.[this.boardId]?.data ?? null;
  }

  /** 게시글 및 게시판 데이터 로드 완료 여부 */
  get articleResponseDataLoad() {
    const article = this.articleStore.select<ArticleDataStateDTO>('articleResponse').value;
    return article?.[this.boardId]?.dataLoad ?? false;
  }

  /** 테이블 선택된 행 */
  selection: ArticleResultDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'articleTitle', header: '제목',
      valueGetter: (data: ArticleResultDTO) => this.articleService.getArticleTitle(data, Number(this.user?.userId)),
    },
    { field: 'articleWriterName', header: '작성자',
      valueGetter: (data: ArticleResultDTO) => this.articleService.getArticleWriterName(data)
    },
    { field: 'createDt', header: '작성일시' },
  ];

  /** 게시판 ID */
  private boardId: number;

  /** 게시글 목록 조회 구독 관리용 */
  private destroy$ = new Subject<void>();

  ngOnInit() {

    // 로그인 화면 or 메인 화면에서 호출 시
    if (this.from === 'login' || this.from === 'main') {
      if (!this.articleResponseDataLoad) {
        this.boardId = this.config.data['boardId'];
        this.articleService.listArticle(this.boardId);
      }
      return;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        this.articleService.listArticle(this.boardId);
      }
    });
  }

  /** 게시글 수정 modal을 표출한다. */
  updateArticle(action: string, article: ArticleResultDTO): void {
    const modal = this.dialogService.open(SaveArticleComponent, {
      focusOnShow: false,
      header: '게시글 수정하기',
      width: '1000px',
      data: { action, article }
    });

    modal.onClose.subscribe((result) => {
      if (isObjectEmpty(result)) return;

      // 게시글 추가/수정/삭제
      if (result.action === 'save') {
        this.articleService.listArticle(this.boardId);
      }
      // 게시글 새로고침(예: 이전/다음 게시글로 이동)
      else if (result.action === 'reload') {
        this.getArticle(result.data.articleId);
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
          this.articleService.listArticle(this.boardId);
        }
        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        else if (result.action === 'reload') {
          this.getArticle(result.data.articleId);
        }
        // 게시글 수정 modal 표출
        else if (result.action === 'update') {
          this.updateArticle(result.action, result.data);
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
    this.articleService.listArticle(this.boardId);
  }

}
