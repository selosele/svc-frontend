import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { CoreBaseComponent } from '@app/shared/components/core';
import { GetVacationRequestDTO, VacationDataStateDTO, VacationResponseDTO } from '@app/vacation/vacation.model';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { UiDateFieldComponent, UiFormComponent } from '@app/shared/components/form';
import { HumanVacationDetailComponent } from '../human-vacation-detail/human-vacation-detail.component';
import { dateUtil } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormComponent,
    UiSkeletonComponent,
    UiTableComponent,
    UiSplitterComponent,
    UiButtonComponent,
    UiDateFieldComponent,
    HumanVacationDetailComponent,
  ],
  selector: 'human-vacation-list',
  templateUrl: './human-vacation-list.component.html',
  styleUrl: './human-vacation-list.component.scss'
})
export class HumanVacationListComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
  ) {
    super();
  }

  /** 테이블 타이틀 */
  @Input() tableTitle: string;

  /** 테이블 텍스트 */
  @Input() tableText: string;

  /** 근무이력목록 조회 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 근무이력 ID */
  get workHistoryId() {
    return this.vacationStore.select<number>('vacationWorkHistoryId').value;
  }

  /** 휴가 목록 */
  get vacationList() {
    const list = this.vacationStore.select<VacationDataStateDTO>('vacationList').value;
    return list?.[this.workHistoryId]?.data ?? null;
  }

  /** 휴가 목록 데이터 로드 완료 여부 */
  get vacationListDataLoad() {
    const list = this.vacationStore.select<VacationDataStateDTO>('vacationList').value;
    return list?.[this.workHistoryId]?.dataLoad ?? false;
  }

  /** 휴가 검색 폼 */
  searchForm: FormGroup;

  /** 휴가 정보 */
  detail: VacationResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: VacationResponseDTO;

  /** 테이블 다운로드 파일명 */
  fileName: string;

  /** 테이블 엑셀 다운로드 헤더 */
  excelHeader = [
    { 'vacationTypeCodeName': '휴가 구분' },
    { 'vacationStartYmd'    : '휴가 시작일자' },
    { 'vacationEndYmd'      : '휴가 종료일자' },
    { 'vacationUseCount'    : '휴가 사용일수' },
    { 'vacationContent'     : '휴가 내용' }
  ];

  /** 테이블 컬럼 */
  cols = [
    { field: 'vacationTypeCodeName', header: '휴가 구분' },
    { field: 'vacationStartYmd',     header: '휴가 시작일자' },
    { field: 'vacationEndYmd',       header: '휴가 종료일자',
      valueGetter: (data: VacationResponseDTO) => `${data.vacationEndYmd} (${data.vacationUseCount}일)`
    },
    { field: 'vacationContent',      header: '휴가 내용' },
  ];

  ngOnInit() {
    this.fileName = `휴가사용목록(${this.user?.employeeName}, ${dateUtil().format('YYYYMMDD')})`;

    this.searchForm = this.fb.group({
      vacationStartYmd: [''], // 휴가 시작일자
      vacationEndYmd: [''],   // 휴가 종료일자
    });

    this.vacationStore.select<number>('vacationWorkHistoryId').asObservable().subscribe((data) => {
      if (!data) return;
      
      if (!this.vacationListDataLoad) {
        this.listVacation({ workHistoryId: data, userId: this.user?.userId });
      }

      this.splitter?.hide();
    });
  }

  /** 휴가 목록을 조회한다. */
  listVacation(dto: GetVacationRequestDTO): void {
    const { workHistoryId } = dto;

    this.vacationService.listVacation$(dto)
    .subscribe((response) => {
      const oldValue = this.vacationStore.select<VacationDataStateDTO>('vacationList').value;
      this.vacationStore.update('vacationList', {
        ...oldValue,
        [workHistoryId]: { data: response, dataLoad: true } // 근무이력 탭별로 휴가 목록을 상태관리
      });
    });
  }

  /** 휴가를 추가한다. */
  addVacation(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 휴가 검색 폼을 전송한다. */
  onSearchFormSubmit(): void {
    this.listVacation({
      ...this.searchForm.value,
      workHistoryId: this.workHistoryId,
      userId: this.user?.userId,
    });
  }

  /** 휴가를 계산한다. */
  onSubmit(value: GetVacationRequestDTO): void {
    this.listVacation(value);
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: TableRowSelectEvent): void {
    this.vacationService.getVacation$(event.data['vacationId'])
    .subscribe((response) => {
      this.detail = response;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: TableRowUnSelectEvent): void {
    this.detail = {};
    this.splitter.hide();
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.searchForm.get('vacationStartYmd').patchValue('');
    this.searchForm.get('vacationEndYmd').patchValue('');
    
    this.listVacation({ workHistoryId: this.workHistoryId, userId: this.user?.userId });
    this.refresh.emit();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listVacation({ workHistoryId: this.workHistoryId, userId: this.user?.userId });
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
