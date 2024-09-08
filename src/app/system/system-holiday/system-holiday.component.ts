import { Component, ViewChild } from '@angular/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { SystemHolidayDetailComponent } from './system-holiday-detail/system-holiday-detail.component';
import { HolidayResponseDTO } from '@app/holiday/holiday.model';
import { HolidayService } from '@app/holiday/holiday.service';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiSkeletonComponent,
    UiTableComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    SystemHolidayDetailComponent,
  ],
  selector: 'view-system-holiday',
  templateUrl: './system-holiday.component.html',
  styleUrl: './system-holiday.component.scss'
})
export class SystemHolidayComponent {

  constructor(
    private holidayService: HolidayService,
  ) {}

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 휴일 목록 */
  get holidayList(): HolidayResponseDTO[] {
    return this.holidayService.holidayList.value;
  }

  /** 휴일 목록 데이터 로드 완료 여부 */
  get holidayListDataLoad() {
    return this.holidayService.holidayListDataLoad.value;
  }

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

  ngOnInit(): void {
    if (!this.holidayListDataLoad) {
      this.listHoliday();
    }
  }

  /** 휴일 목록을 조회한다. */
  listHoliday(): void {
    this.holidayService.listHoliday();
  }

  /** 휴일을 추가한다. */
  addHoliday(): void {
    this.holidayDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.holidayService.getHoliday$(event.data['ymd'])
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
