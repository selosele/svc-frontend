import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiButtonComponent, UiSkeletonComponent } from '@app/shared/components/ui';
import { VacationByMonthResponseDTO, VacationStatsResponseDTO, VacationStatsResultDTO } from '@app/vacation/vacation.model';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiSkeletonComponent,
    UiButtonComponent,
  ],
  selector: 'view-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private router: Router,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
  ) {
    super();
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
  onMoreClick(): void {
    this.router.navigate(['/hm/vacations'], { queryParams: { menuId: this.getMenuIdByMenuUrl('/hm/vacations') } });
  }

}
