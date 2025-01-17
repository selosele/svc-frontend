import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService, UiDialogService } from '@app/shared/services';
import { ArticleService } from '../article.service';
import { ArticleDataStateDTO, ArticleResultDTO } from '../article.model';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTableComponent,
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
    private dialogService: UiDialogService,
    private articleService: ArticleService,
  ) {}

  /** 게시판 ID */
  private boardId: number;

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

  /** 테이블 선택된 행 */
  selection: ArticleResultDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'articleTitle',      header: '제목' },
    { field: 'articleWriterName', header: '작성자',
      valueGetter: (data: ArticleResultDTO) => {
        if (data.isSystemAdmin === 1) {
          return `<strong>${data.articleWriterName}</strong>`;
        }
        return data.articleWriterName;
      }
    },
    { field: 'createDt',          header: '작성일시' },
  ];

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

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    // this.dialogService.open(SystemRoleDetailComponent, {
    //   focusOnShow: false,
    //   header: `"${event.data['roleName']}" 권한별 사용자 및 메뉴 목록 조회`,
    //   data: { userList, menuTree },
    // });
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listArticle();
  }

}
