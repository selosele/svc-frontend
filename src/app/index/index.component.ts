import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UiDialogService, UiLoadingService } from '@app/shared/services';
import { EmployeeStore } from '@app/employee/employee.store';
import { EmployeeService } from '@app/employee/employee.service';
import { BoardStore } from '@app/board/board.store';
import { BoardService } from '@app/board/board.service';
import { ArticleStore } from '@app/article/article.store';
import { ArticleService } from '@app/article/article.service';
import { PayslipStore } from '@app/payslip/payslip.store';
import { PayslipService } from '@app/payslip/payslip.service';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { CoreBaseComponent } from '@app/shared/components/core';
import { ArticleViewComponent } from '@app/article/article-view/article-view.component';
import { ArticleListComponent } from '@app/article/article-list/article-list.component';
import { SaveArticleComponent } from '@app/article/save-article/save-article.component';
import { UiButtonComponent, UiChartComponent, UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { EmployeeResultDTO } from '@app/employee/employee.model';
import { BoardResultDTO } from '@app/board/board.model';
import { ArticleDataStateDTO, ArticleResultDTO } from '@app/article/article.model';
import { PayslipResponseDTO } from '@app/payslip/payslip.model';
import { VacationByMonthResultDTO, VacationStatsResponseDTO, VacationStatsResultDTO } from '@app/vacation/vacation.model';
import { isObjectEmpty } from '@app/shared/utils';
import { WorkHistoryService } from '@app/work-history/work-history.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiSkeletonComponent,
    UiButtonComponent,
    UiTabComponent,
    UiChartComponent,
  ],
  selector: 'view-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class IndexComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private router: Router,
    private loadingService: UiLoadingService,
    private dialogService: UiDialogService,
    private employeeStore: EmployeeStore,
    private employeeService: EmployeeService,
    private boardStore: BoardStore,
    private boardService: BoardService,
    private articleStore: ArticleStore,
    private articleService: ArticleService,
    private payslipStore: PayslipStore,
    private payslipService: PayslipService,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
    private workHistoryService: WorkHistoryService,
  ) {
    super();
  }

  /** 직원 정보 */
  get mainEmployee() {
    return this.employeeStore.select<EmployeeResultDTO>('mainEmployee').value;
  }

  /** 직원 정보 데이터 로드 완료 여부 */
  get mainEmployeeDataLoad() {
    return this.employeeStore.select<boolean>('mainEmployeeDataLoad').value;
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
    return this.boardStore.select<number>('mainBoardTabKey').value;
  }

  /**
   * 선택된 게시판 탭의 index
   *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
   */
  get mainBoardTabIndex() {
    return this.boardStore.select<number>('mainBoardTabIndex').value;
  }

  /** 선택된 게시판 탭의 index를 변경한다. */
  set mainBoardTabIndex(value: number) {
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

  /** 급여명세서 정보 */
  get mainPayslipResponse() {
    return this.payslipStore.select<PayslipResponseDTO>('mainPayslipResponse').value;
  }

  /** 급여명세서 정보 데이터 로드 완료 여부 */
  get mainPayslipResponseDataLoad() {
    return this.payslipStore.select<boolean>('mainPayslipResponseDataLoad').value;
  }

  /** 최신 급여명세서 정보 */
  get currentPayslip() {
    return this.mainPayslipResponse?.payslip;
  }

  /** 급여 탭 목록 */
  get mainPayslipTabList() {
    return this.payslipStore.select<Tab[]>('mainPayslipTabList').value;
  }

  /** 선택된 급여 탭의 key */
  get mainPayslipTabKey() {
    return this.payslipStore.select<string>('mainPayslipTabKey').value || 'A00';
  }

  /**
   * 선택된 급여 탭의 index
   *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
   */
  get mainPayslipTabIndex() {
    return this.payslipStore.select<number>('mainPayslipTabIndex').value;
  }

  /** 선택된 급여 탭의 index를 변경한다. */
  set mainPayslipTabIndex(value: number) {
    this.payslipStore.update('mainPayslipTabIndex', value);
  }

  /** 휴가 통계 정보 */
  get vacationStatResponse() {
    return this.vacationStore.select<VacationStatsResponseDTO>('vacationStatResponse').value;
  }

  /** 휴가 통계 정보 데이터 로드 완료 여부 */
  get vacationStatResponseDataLoad() {
    return this.vacationStore.select<boolean>('vacationStatResponseDataLoad').value;
  }

  /** 급여차트 데이터 */
  chartData: any;

  /** 급여차트 옵션 */
  chartOptions: any;

  /** 선택된 게시판 탭의 게시판 ID */
  activeBoardId: number;

  /** 월별 휴가사용일수 목록 */
  vacationListByMonth: VacationByMonthResultDTO[] = [];

  /** 휴가통계 목록 클릭된 항목의 ID */
  statsItemClickId: number;

  /** 최신 근무이력 ID */
  currentWorkHistoryId: number;

  /** 게시글 목록 조회 개수 */
  private articleLimit = 6;

  ngOnInit() {
    this.activeBoardId = this.boardStore.select<number>('mainBoardTabKey').value;

    if (this.user) {
      this.getEmployee();
    }

    if (!this.mainBoardListDataLoad && !this.mainArticleResponseDataLoad && this.user) {
      this.listBoard();
    }

    if (this.user) {
      this.getCurrentPayslip();
    }

    if (this.currentPayslip !== null) {
      this.initChartData();
    }

    if (this.user) {
      this.listVacationStats();
    }
  }

  /** 직원을 조회한다. */
  getEmployee(): void {
    this.employeeService.getEmployee$(this.user?.employeeId)
    .subscribe((response) => {
      this.employeeStore.update('mainEmployee', response.employee);
      this.employeeStore.update('mainEmployeeDataLoad', true);
    });
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
  onMainBoardTabChange(event: UiTabChangeEvent): void {
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
        if (result.action === this.actions.SAVE) {
          this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
        }
        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        else if (result.action === this.actions.RELOAD) {
          this.onArticleItemClick(result.data.articleId);
        }
        // 게시글 수정 modal 표출
        else if (result.action === this.actions.UPDATE) {
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
      if (result.action === this.actions.SAVE) {
        this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
      }
      // 게시글 새로고침(예: 이전/다음 게시글로 이동)
      else if (result.action === this.actions.RELOAD) {
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
        if (result.action === this.actions.SAVE) {
          this.articleService.listMainArticle(this.activeBoardId, this.articleLimit);
        }
        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        else if (result.action === this.actions.RELOAD) {
          this.getArticle(result.data.articleId);
        }
        // 게시글 수정 modal 표출
        else if (result.action === this.actions.UPDATE) {
          this.updateArticle(result.action, result.data);
        }
      });
    });
  }

  /** 최신 급여명세서를 조회한다. */
  async getCurrentPayslip(): Promise<void> {
    const currentWorkHistoryResponse = await lastValueFrom(this.workHistoryService.getCurrentWorkHistory$(this.user?.employeeId));
    this.currentWorkHistoryId = currentWorkHistoryResponse?.workHistory?.workHistoryId;

    this.payslipService.listPayslip$({
      userId: this.user?.userId,
      workHistoryId: this.currentWorkHistoryId,
      isGetCurrent: 'Y',
    })
    .subscribe((response) => {
      this.payslipStore.update('mainPayslipResponseDataLoad', true);
      this.payslipStore.update('mainPayslipResponse', response);
      this.payslipStore.update('mainPayslipTabList', [
        { title: '지급내역', key: 'A00', dataLoad: true },
        { title: '공제내역', key: 'B00', dataLoad: true },
      ]);
      this.initChartData();
    });
  }

  /** 급여차트를 초기화한다. */
  initChartData(): void {
    const labels = this.getSalaryAmountCodeNameList(this.mainPayslipTabKey);
    const data = this.getSalaryAmountList(this.mainPayslipTabKey);

    this.chartData = {
      labels,
      datasets: [
        {
          label: '금액',
          data,
          backgroundColor: [
            this.documentStyle.getPropertyValue('--primary-500'),
            this.documentStyle.getPropertyValue('--orange-500'),
            this.documentStyle.getPropertyValue('--gray-500'),
          ],
          hoverBackgroundColor: [
            this.documentStyle.getPropertyValue('--primary-400'),
            this.documentStyle.getPropertyValue('--orange-400'),
            this.documentStyle.getPropertyValue('--gray-400'),
          ]
        }
      ]
    };

    this.chartOptions = {};
  }

  /** 급여차트 탭을 클릭한다. */
  onMainPayslipTabChange(event: UiTabChangeEvent): void {
    this.payslipStore.update('mainPayslipTabIndex', event.index);
    this.payslipStore.update('mainPayslipTabKey', event.activeKey);
    this.initChartData();
  }

  /** 최신 급여명세서 정보 > 급여내역 금액 코드명 목록을 반환한다. */
  getSalaryAmountCodeNameList(salaryTypeCode: string) {
    return this.currentPayslip?.payslipSalaryDetailList
      .filter(x => x.salaryTypeCode === salaryTypeCode && x.salaryAmount !== null)
      .map(x => x.salaryAmountCodeName);
  }

  /** 최신 급여명세서 정보 > 급여내역 금액 목록을 반환한다. */
  getSalaryAmountList(salaryTypeCode: string) {
    return this.currentPayslip?.payslipSalaryDetailList
      .filter(x => x.salaryTypeCode === salaryTypeCode && x.salaryAmount !== null)
      .map(x => x.salaryAmount);
  }

  /** 급여관리 페이지로 이동한다. */
  onSalaryMoreClick(): void {
    this.router.navigate(['/sa/payslips'], { queryParams: { menuId: this.getMenuIdByMenuUrl('/sa/payslips') } });
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
      employeeId: Number(this.user?.employeeId),
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
