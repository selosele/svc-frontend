import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BoardStore } from '@app/board/board.store';
import { BoardService } from '@app/board/board.service';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiButtonComponent, UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { BoardResponseDTO } from '@app/board/board.model';
import { VacationByMonthResponseDTO, VacationStatsResponseDTO, VacationStatsResultDTO } from '@app/vacation/vacation.model';

@Component({
  standalone: true,
  imports: [
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
    private boardStore: BoardStore,
    private boardService: BoardService,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
  ) {
    super();
  }

  /** 메인화면 게시판 목록 */
  get mainBoardList() {
    return this.boardStore.select<BoardResponseDTO[]>('mainBoardList').value;
  }

  /** 메인화면 게시판 목록 데이터 로드 완료 여부 */
  get mainBoardListDataLoad() {
    return this.boardStore.select<boolean>('mainBoardListDataLoad').value;
  }

  /** 메인화면 게시판 탭 목록 */
  get mainBoardTabList() {
    return this.boardStore.select<Tab[]>('mainBoardTabList').value;
  }

  /**
   * 선택된 메인화면 게시판 탭의 index
   *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
   */
  get activeIndex() {
    return this.boardStore.select<number>('mainBoardTabIndex').value;
  }

  /** 선택된 메인화면 게시판 탭의 index를 변경한다. */
  set activeIndex(value: number) {
    this.boardStore.update('mainBoardTabIndex', value);
  }

  /** 휴가 통계 정보 */
  get vacationStatResponse() {
    return this.vacationStore.select<VacationStatsResponseDTO>('vacationStatResponse').value;
  }

  /** 휴가 통계 정보 데이터 로드 완료 여부 */
  get vacationStatResponseDataLoad() {
    return this.vacationStore.select<boolean>('vacationStatResponseDataLoad').value;
  }

  /** 월별 휴가사용일수 목록 */
  vacationListByMonth: VacationByMonthResponseDTO[] = [];

  /** 휴가통계 목록 클릭된 항목의 ID */
  statsItemClickId: number;

  ngOnInit() {
    if (!this.vacationStatResponseDataLoad && this.user) {
      this.listVacationStats();
    }

    if (!this.mainBoardListDataLoad && this.user) {
      this.listBoard();
    }
  }

  /** 게시판 목록을 조회한다. */
  listBoard(): void {
    this.boardService.listBoard$({ mainShowYn: 'Y', useYn: 'Y' })
    .subscribe((data) => {
      this.boardStore.update('mainBoardList', data);
      this.boardStore.update('mainBoardListDataLoad', true);
      this.boardStore.update('mainBoardTabList', data.map(x => ({ title: x.boardName, key: x.boardId, dataLoad: true })));
    });
  }

  /** 휴가 통계 목록을 조회한다. */
  listVacationStats(): void {
    this.vacationService.listVacationStats$({ userId: this.user?.userId })
    .subscribe((data) => {
      this.vacationStore.update('vacationStatResponse', data);
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
    .subscribe((data) => {
      this.vacationListByMonth = data;
    });
  }

  /** 휴가관리 페이지로 이동한다. */
  onVacationMoreClick(): void {
    this.router.navigate(['/hm/vacations'], { queryParams: { menuId: this.getMenuIdByMenuUrl('/hm/vacations') } });
  }

  /** 메인화면 게시판 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.boardStore.update('mainBoardTabIndex', event.index);
  }

}
