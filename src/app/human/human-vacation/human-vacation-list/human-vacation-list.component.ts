import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CodeService } from '@app/code/code.service';
import { VacationResponseDTO } from '@app/human/human.model';
import { HumanService } from '@app/human/human.service';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiButtonComponent, UiCardComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiCardComponent,
    UiTableComponent,
    UiSplitterComponent,
    UiButtonComponent,
  ],
  selector: 'human-vacation-list',
  templateUrl: './human-vacation-list.component.html',
  styleUrl: './human-vacation-list.component.scss'
})
export class HumanVacationListComponent implements OnChanges {

  constructor(
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 직원 회사 ID */
  @Input() employeeCompanyId: number;

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 휴가 코드 데이터 목록 */
  vacationTypeCodes: DropdownData[] = this.codeService.getDropdownData('VACATION_TYPE_00');

  /** 휴가 목록 데이터 로드 완료 여부 */
  vacationListDataLoad = false;

  /** 휴가 목록 */
  vacationList: VacationResponseDTO[] = [];

  /** 휴가 정보 */
  vacationDetail: VacationResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: VacationResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { header: '휴가 구분',
      valueGetter: (data) => this.vacationTypeCodes.find(x => x.value === data.vacationTypeCode)?.label
    },
    { field: 'vacationStartYmd', header: '휴가 시작일자' },
    { field: 'vacationEndYmd',   header: '휴가 종료일자' },
    { field: 'vacationContent',  header: '휴가 내용' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employeeCompanyId) {
      this.employeeCompanyId = changes.employeeCompanyId.currentValue;
      this.listVacation();
    }
  }

  /** 휴가 목록을 조회한다. */
  listVacation(): void {
    this.humanService.listVacation$({ employeeCompanyId: this.employeeCompanyId })
    .subscribe((data) => {
      this.vacationList = data;
      this.vacationListDataLoad = true;
    });
  }

  /** 휴가를 등록한다. */
  addVacation(): void {
    this.vacationDetail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    // this.humanService.getVacation$(event.data['vacationId'])
    // .subscribe((data) => {
    //   this.vacationDetail = data;
    //   this.splitter.show();
    // });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.vacationDetail = {};
    this.splitter.hide();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listVacation();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listVacation();
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
