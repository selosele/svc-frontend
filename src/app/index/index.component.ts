import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '@app/shared/services';
import { AuthService } from '@app/auth/auth.service';
import { MenuService } from '@app/menu/menu.service';
import { VacationService } from '@app/vacation/vacation.service';
import { UiButtonComponent, UiSkeletonComponent } from '@app/shared/components/ui';
import { VacationByMonthResponseDTO, VacationStatsResponseDTO, VacationStatsResultDTO } from '@app/vacation/vacation.model';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiButtonComponent,
  ],
  selector: 'view-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {

  constructor(
    private router: Router,
    private store: StoreService,
    private authService: AuthService,
    private menuService: MenuService,
    private vacationService: VacationService,
  ) {}

  /** 인증된 사용자 정보 */
  get user() {
    return this.authService.getAuthenticatedUser();
  }

  /** 메뉴 ID 정보 */
  get menuInfo() {
    return this.menuService.menuIdInfo;
  }

  /** 휴가 통계 정보 */
  get vacationStatResponse() {
    return this.store.select<VacationStatsResponseDTO>('vacationStatResponse').value;
  }

  /** 휴가 통계 정보 데이터 로드 완료 여부 */
  get vacationStatResponseDataLoad() {
    return this.store.select<boolean>('vacationStatResponseDataLoad').value;
  }

  /** 월별 휴가사용일수 목록 */
  vacationListByMonth: VacationByMonthResponseDTO[] = [];

  /** 휴가통계 목록 클릭된 항목의 ID */
  statsItemClickId: number;

  ngOnInit() {
    if (!this.vacationStatResponseDataLoad) {
      this.listVacationStats();
    }
  }

  /** 휴가 통계 목록을 조회한다. */
  listVacationStats(): void {
    this.vacationService.listVacationStats$({ userId: this.user?.userId })
    .subscribe((data) => {
      this.store.update('vacationStatResponse', data);
      this.store.update('vacationStatResponseDataLoad', true);
    });
  }

  /** 휴가관리 페이지로 이동한다. */
  onMoreClick(): void {
    this.router.navigate(['/hm/vacations'], { queryParams: { menuId: this.menuInfo.VACATIONS } });
  }

  /** 휴가통계 목록 항목을 클릭한다. */
  onStatsItemClick(event: Event, i: VacationStatsResultDTO): void {
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

}
