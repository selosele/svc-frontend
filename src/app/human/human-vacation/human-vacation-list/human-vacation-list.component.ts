import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CodeService } from '@app/code/code.service';
import { VacationResponseDTO, VacationTabViewItem } from '@app/human/human.model';
import { HumanService } from '@app/human/human.service';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiButtonComponent, UiCardComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { HumanVacationDetailComponent } from '../human-vacation-detail/human-vacation-detail.component';
import { dateUtil, isEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiCardComponent,
    UiTableComponent,
    UiSplitterComponent,
    UiButtonComponent,
    HumanVacationDetailComponent,
  ],
  selector: 'human-vacation-list',
  templateUrl: './human-vacation-list.component.html',
  styleUrl: './human-vacation-list.component.scss'
})
export class HumanVacationListComponent implements OnInit {

  constructor(
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 근무이력 ID */
  get workHistoryId(): number {
    return this.humanService.workHistoryId.value;
  }

  /** 테이블 타이틀 */
  @Input() tableTitle: string;

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 휴가 코드 데이터 목록 */
  vacationTypeCodes = this.codeService.createCodeData('VACATION_TYPE_00');

  /** 휴가 목록 데이터 로드 완료 여부 */
  vacationListDataLoad = false;

  /** 모든 탭의 휴가 목록 */
  vacationList: VacationTabViewItem[]= [];

  /** 선택된 탭의 휴가 목록 */
  vacationListCurrent: VacationResponseDTO[] = [];

  /** 휴가 정보 */
  vacationDetail: VacationResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: VacationResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { header: '휴가 구분',
      valueGetter: (data: VacationResponseDTO) => this.vacationTypeCodes.find(x => x.value === data.vacationTypeCode)?.label
    },
    { field: 'vacationStartYmd', header: '휴가 시작일자' },
    { field: 'vacationEndYmd',   header: '휴가 종료일자' },
    { header: '휴가 사용일수',
      valueGetter: (data: VacationResponseDTO) => `${data.vacationUseCount}일`
    },
    { field: 'vacationContent',  header: '휴가 내용' },
  ];

  ngOnInit(): void {
    this.humanService.workHistoryId$.subscribe((data) => {
      if (!data) return;

      const currentItem = this.vacationList.find(x => x.key === data);
      if (isEmpty(currentItem)) {
        this.listVacation(data);
      }
      this.vacationListCurrent = currentItem?.value;
    });
  }

  /** 휴가 목록을 조회한다. */
  listVacation(workHistoryId: number): void {
    this.humanService.listVacation$({ workHistoryId })
    .subscribe((data) => {
      if (isEmpty(this.vacationList.find(x => x.key === workHistoryId)?.value)) {
        this.vacationList.push({ key: workHistoryId, value: data });
        this.vacationListCurrent = this.vacationList.find(x => x.key === workHistoryId)?.value;
        this.vacationListDataLoad = true;
      }
      else {
        this.vacationList.forEach(x => {
          if (x.key === workHistoryId) x.value = data;
        });
        this.vacationListCurrent = data;
      }
    });
  }

  /** 휴가를 등록한다. */
  addVacation(): void {
    this.vacationDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.humanService.getVacation$(event.data['vacationId'])
    .subscribe((data) => {
      this.vacationDetail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.vacationDetail = {};
    this.splitter.hide();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listVacation(this.workHistoryId);
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listVacation(this.workHistoryId);
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
