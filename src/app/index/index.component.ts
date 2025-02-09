import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UiDialogService, UiLoadingService } from '@app/shared/services';
import { BoardStore } from '@app/board/board.store';
import { BoardService } from '@app/board/board.service';
import { ArticleStore } from '@app/article/article.store';
import { ArticleService } from '@app/article/article.service';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { CoreBaseComponent } from '@app/shared/components/core';
import { ArticleViewComponent } from '@app/article/article-view/article-view.component';
import { ArticleListComponent } from '@app/article/article-list/article-list.component';
import { SaveArticleComponent } from '@app/article/save-article/save-article.component';
import { UiButtonComponent, UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { BoardResultDTO } from '@app/board/board.model';
import { ArticleDataStateDTO, ArticleResultDTO } from '@app/article/article.model';
import { VacationByMonthResultDTO, VacationStatsResponseDTO, VacationStatsResultDTO } from '@app/vacation/vacation.model';
import { isObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiSkeletonComponent,
    UiButtonComponent,
    UiTabComponent,
  ],
  selector: 'view-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private router: Router,
    private loadingService: UiLoadingService,
    private dialogService: UiDialogService,
    private boardStore: BoardStore,
    private boardService: BoardService,
    private articleStore: ArticleStore,
    private articleService: ArticleService,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
  ) {
    super();
  }

  /** 게시판 목록 */
  get mainBoardList() {
    return this.boardStore.select<BoardResultDTO[]>('mainBoardList').value;
  }

  /** 게시판 목록 데이터 로드 완료 여부 */
  get mainBoardListDataLoad() {
    return this.boardStore.select<boolean>('mainBoardListDataLoad').value;
  }

  /** 게시판 탭 목록 */
  get mainBoardTabList() {
    return this.boardStore.select<Tab[]>('mainBoardTabList').value;
  }

  /** 선택된 게시판 탭의 게시판 ID */
  get mainBoardTabKey() {
    return this.boardStore.select<number>('mainBoardTabKey').value
  }

  /**
   * 선택된 게시판 탭의 index
   *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
   */
  get activeIndex() {
    return this.boardStore.select<number>('mainBoardTabIndex').value;
  }

  /** 선택된 게시판 탭의 index를 변경한다. */
  set activeIndex(value: number) {
    this.boardStore.update('mainBoardTabIndex', value);
  }

  /** 게시글 및 게시판 정보 */
  get mainArticleResponse() {
    const article = this.articleStore.select<ArticleDataStateDTO>('mainArticleResponse').value;
    return article?.[this.activeBoardId]?.data ?? null;
  }

  /** 게시글 및 게시판 데이터 로드 완료 여부 */
  get mainArticleResponseDataLoad() {
    const article = this.articleStore.select<ArticleDataStateDTO>('mainArticleResponse').value;
    return article?.[this.activeBoardId]?.dataLoad ?? false;
  }

  /** 휴가 통계 정보 */
  get vacationStatResponse() {
    return this.vacationStore.select<VacationStatsResponseDTO>('vacationStatResponse').value;
  }

  /** 휴가 통계 정보 데이터 로드 완료 여부 */
  get vacationStatResponseDataLoad() {
    return this.vacationStore.select<boolean>('vacationStatResponseDataLoad').value;
  }

  /** 선택된 게시판 탭의 게시판 ID */
  activeBoardId: number;

  /** 월별 휴가사용일수 목록 */
  vacationListByMonth: VacationByMonthResultDTO[] = [];

  /** 휴가통계 목록 클릭된 항목의 ID */
  statsItemClickId: number;

  /** 게시글 목록 조회 개수 */
  private articleLimit = 6;

  ngOnInit() {
    this.activeBoardId = this.boardStore.select<number>('mainBoardTabKey').value;

    if (!this.mainBoardListDataLoad && !this.mainArticleResponseDataLoad && this.user) {
      this.listBoard();
    }

    if (!this.vacationStatResponseDataLoad && this.user) {
      this.listVacationStats();
    }
  }

  /** 게시판 목록을 조회한다. */
  listBoard(): void {
    this.boardService.listMainBoard$()
    .subscribe((response) => {
      this.boardStore.update('mainBoardListDataLoad', true);
      this.boardStore.update('mainBoardList', response.boardList);
      this.boardStore.update('mainBoardTabList', response.boardList.map(x => ({ title: x.boardName, key: x.boardId, dataLoad: true })));
      this.boardStore.update('mainBoardTabKey', Number(this.mainBoardTabList[0].key))

      this.activeBoardId = Number(this.mainBoardTabList[0].key);
      this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
    });
  }

  /** 게시판 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.boardStore.update('mainBoardTabIndex', event.index);
    this.boardStore.update('mainBoardTabKey', Number(event.activeKey));
    this.activeBoardId = Number(event.activeKey);

    if (!this.mainArticleResponseDataLoad) {
      this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
    }
  }

  /** 게시글 목록 항목을 클릭한다. */
  onArticleItemClick(articleId: number): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);
    
    this.articleService.getArticle$(articleId)
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      const modal = this.dialogService.open(ArticleViewComponent, {
        focusOnShow: false,
        header: response.article.articleTitle,
        width: '1000px',
        data: response,
      });

      modal?.onClose.subscribe((result) => {
        if (isObjectEmpty(result)) return;

        // 게시글 추가/수정/삭제
        if (result.action === 'save') {
          this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
        }
        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        else if (result.action === 'reload') {
          this.onArticleItemClick(result.data.articleId);
        }
        // 게시글 수정 modal 표출
        else if (result.action === 'update') {
          this.updateArticle(result.action, result.data);
        }
      });
    });
  }

  /** 게시글 목록 modal을 표출한다. */
  onArticleMoreClick(boardId: number): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);
    
    this.boardService.getBoard$(boardId)
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      this.dialogService.open(ArticleListComponent, {
        focusOnShow: false,
        header: response.board.boardName,
        width: '1200px',
        height: '100%',
        data: { boardId, from: 'main' },
      });
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
        this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
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
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      const modal = this.dialogService.open(ArticleViewComponent, {
        focusOnShow: false,
        header: response.article.articleTitle,
        width: '1000px',
        data: response,
      });

      modal?.onClose.subscribe((result) => {
        if (isObjectEmpty(result)) return;

        // 게시글 추가/수정/삭제
        if (result.action === 'save') {
          this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
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

  /** 휴가 통계 목록을 조회한다. */
  listVacationStats(): void {
    this.vacationService.listVacationStats$({ userId: this.user?.userId })
    .subscribe((response) => {
      this.vacationStore.update('vacationStatResponse', response);
      this.vacationStore.update('vacationStatResponseDataLoad', true);
    });
  }

  /** 휴가통계 목록 항목을 클릭한다. */
  onStatsItemClick(i: VacationStatsResultDTO): void {
    this.statsItemClickId = i.vacationStatsId;

    this.vacationService.listVacationByMonth$({
      yyyy: i.yyyy,
      workHistoryId: i.workHistoryId,
      vacationTypeCode: i.vacationTypeCode
    })
    .subscribe((response) => {
      this.vacationListByMonth = response.vacationByMonthList;
    });
  }

  /** 휴가관리 페이지로 이동한다. */
  onVacationMoreClick(): void {
    this.router.navigate(['/hm/vacations'], { queryParams: { menuId: this.getMenuIdByMenuUrl('/hm/vacations') } });
  }

}
