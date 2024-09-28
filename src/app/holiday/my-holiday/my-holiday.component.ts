import { Component, ViewChild } from '@angular/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { MyHolidayDetailComponent } from './my-holiday-detail/my-holiday-detail.component';
import { HolidayResponseDTO } from '@app/holiday/holiday.model';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { HolidayService } from '@app/holiday/holiday.service';
import { StoreService } from '@app/shared/services';
import { AuthService } from '@app/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiSkeletonComponent,
    UiTableComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    MyHolidayDetailComponent,
  ],
  selector: 'view-my-holiday',
  templateUrl: './my-holiday.component.html',
  styleUrl: './my-holiday.component.scss'
})
export class MyHolidayComponent {

  constructor(
    private store: StoreService,
    private authService: AuthService,
    private holidayService: HolidayService,
  ) {}

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 휴일 목록 */
  get holidayList(): HolidayResponseDTO[] {
    return this.store.select<HolidayResponseDTO[]>('holidayList').value;
  }

  /** 휴일 목록 데이터 로드 완료 여부 */
  get holidayListDataLoad() {
    return this.store.select<boolean>('holidayListDataLoad').value;
  }

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 휴일 정보 */
  holidayDetail: HolidayResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: HolidayResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'ymd',            header: '일자' },
    { field: 'holidayName',    header: '휴일명' },
    { field: 'holidayContent', header: '휴일 내용' },
    { field: 'useYn',          header: '사용 여부' },
  ];

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();

    if (!this.holidayListDataLoad) {
      this.listHoliday();
    }
  }

  /** 휴일 목록을 조회한다. */
  listHoliday(): void {
    this.holidayService.listHoliday(this.user.userId);
  }

  /** 휴일을 추가한다. */
  addHoliday(): void {
    this.holidayDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.holidayService.getHoliday$(this.user.userId, event.data['ymd'])
    .subscribe((data) => {
      this.holidayDetail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.holidayDetail = {};
    this.splitter.hide();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listHoliday();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listHoliday();
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
