import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService, UiDialogService } from '@app/shared/services';
import { ArticleService } from '../article.service';
import { ArticleResponseDTO } from '../article.model';
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
  boardId: number;

  /** 게시글 목록 */
  get articleList() {
    return this.store.select<ArticleResponseDTO[]>('articleList').value;
  }

  /** 게시글 목록 데이터 로드 완료 여부 */
  get articleListDataLoad() {
    return this.store.select<boolean>('articleListDataLoad').value;
  }

  /** 테이블 선택된 행 */
  selection: ArticleResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'articleTitle',      header: '제목' },
    { field: 'articleWriterName', header: '작성자' },
    { field: 'createDt',          header: '작성일시' },
  ];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.boardId = params['boardId'];

      if (!this.articleListDataLoad) {
        this.listArticle();
      }
    });
  }

  /** 게시글 목록을 조회한다. */
  listArticle(): void {
    this.articleService.listArticle$({ boardId: this.boardId })
    .subscribe((data) => {
      // TODO: 게시판 ID별로 게시글 목록을 상태관리해야 함. 다른 게시판으로 이동시 게시글이 그대로 남아 있음
      this.store.update('articleList', data);
      this.store.update('articleListDataLoad', data);
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
