import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreBaseComponent } from '@app/shared/components/core';
import { PayslipStore } from '@app/payslip/payslip.store';
import { PayslipService } from '@app/payslip/payslip.service';
import { GetPayslipRequestDTO, PayslipDataStateDTO, PayslipResponseDTO } from '@app/payslip/payslip.model';
import { WorkHistoryResponseDTO } from '@app/work-history/work-history.model';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { UiDateFieldComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { dateUtil } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormComponent,
    UiSkeletonComponent,
    UiTableComponent,
    UiButtonComponent,
    UiTextFieldComponent,
    UiDateFieldComponent,
  ],
  selector: 'salary-payslip-list',
  templateUrl: './salary-payslip-list.component.html',
  styleUrl: './salary-payslip-list.component.scss'
})
export class SalaryPayslipListComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private payslipStore: PayslipStore,
    private payslipService: PayslipService,
  ) {
    super();
  }

  /** 테이블 타이틀 */
  @Input() tableTitle: string;

  /** 테이블 텍스트 */
  @Input() tableText: string;

  /** 근무이력목록 조회 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 근무이력 ID */
  get workHistoryId() {
    return this.payslipStore.select<number>('payslipWorkHistoryId').value;
  }

  /** 급여명세서 목록 */
  get payslipList() {
    const list = this.payslipStore.select<PayslipDataStateDTO>('payslipList').value;
    return list?.[this.workHistoryId]?.data ?? null;
  }

  /** 급여명세서 목록 데이터 로드 완료 여부 */
  get payslipListDataLoad() {
    const list = this.payslipStore.select<PayslipDataStateDTO>('payslipList').value;
    return list?.[this.workHistoryId]?.dataLoad ?? false;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.payslipStore.select<WorkHistoryResponseDTO[]>('payslipWorkHistoryList').value;
  }

  /** 선택된 회사 탭의 index */
  get activeIndex() {
    return this.payslipStore.select<number>('payslipWorkHistoryTabIndex').value;
  }

  /** 급여명세서 검색 폼 */
  searchForm: FormGroup;

  /** 테이블 선택된 행 */
  selection: PayslipResponseDTO;

  /** 테이블 다운로드 파일명 */
  fileName: string;

  /** 테이블 엑셀 다운로드 헤더 */
  excelHeader = [
    { 'totalAmountA00'   : '지급총액' },
    { 'totalAmountB00'   : '공제합계' },
    { 'totalAmount'      : '실지급액(지급총액-공제합계)' },
    { 'payslipPaymentYmd': '지급일자' },
    { 'payslipNote'      : '비고' },
  ];

  /** 테이블 컬럼 */
  cols = [
    { field: 'totalAmountA00',       header: '지급총액',
      valueGetter: (data: PayslipResponseDTO) => `+${data.totalAmountA00}원`
    },
    { field: 'totalAmountB00',       header: '공제합계',
      valueGetter: (data: PayslipResponseDTO) => `-${data.totalAmountB00}원`
    },
    { field: 'totalAmount',          header: '실지급액(지급총액-공제합계)',
      valueGetter: (data: PayslipResponseDTO) => `<strong>${data.totalAmount}원</strong>`
    },
    { field: 'payslipPaymentYmd',    header: '지급일자',
      valueGetter: (data: PayslipResponseDTO) => `${dateUtil(data.payslipPaymentYmd).format('YYYY년 MM월 DD일')}`
    },
    { field: 'payslipNote',          header: '비고' },
  ];

  ngOnInit(): void {
    this.fileName = `급여명세서 목록(${this.user?.employeeName})`;

    this.searchForm = this.fb.group({
      joinYmd: [''],            // 입사일자
      quitYmd: [''],            // 퇴사일자
      payslipPaymentYYYY: [''], // 급여명세서 지급 연도
      payslipPaymentMM: [''],   // 급여명세서 지급 월
    });

    this.payslipStore.select<number>('payslipWorkHistoryId').asObservable().subscribe((data) => {
      if (!data) return;

      this.searchForm.get('joinYmd').patchValue(this.workHistoryList[this.activeIndex]?.joinYmd);
      this.searchForm.get('quitYmd').patchValue(this.workHistoryList[this.activeIndex]?.quitYmd);
      
      if (!this.payslipListDataLoad) {
        this.listPayslip({ workHistoryId: data, userId: this.user?.userId });
      }
    });
  }

  /** 급여명세서 목록을 조회한다. */
  listPayslip(dto: GetPayslipRequestDTO): void {
    const { workHistoryId } = dto;

    this.payslipService.listPayslip$(dto)
    .subscribe((data) => {
      const oldValue = this.payslipStore.select<PayslipDataStateDTO>('payslipList').value;
      this.payslipStore.update('payslipList', {
        ...oldValue,
        [workHistoryId]: { data, dataLoad: true } // 근무이력 탭별로 급여명세서 목록을 상태관리
      });
    });
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    
  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listPayslip({ workHistoryId: this.workHistoryId, userId: this.user?.userId });
    this.refresh.emit();
  }

  /** 급여명세서 검색 폼을 전송한다. */
  onSearchFormSubmit(): void {
    this.listPayslip({
      ...this.searchForm.value,
      workHistoryId: this.workHistoryId,
      userId: this.user?.userId,
    });
  }

  /** 급여명세서를 검색한다. */
  onSubmit(value: GetPayslipRequestDTO): void {
    this.listPayslip(value);
  }

  /** 급여명세서를 추가한다. */
  addPayslip(): void {

  }

  /** 입사일자 값을 설정한다. */
  private setJoinYmd(): void {
    const joinYmd = this.workHistoryList?.[this.activeIndex]?.joinYmd || this.user?.joinYmd;
    const quitYmd = this.workHistoryList?.[this.activeIndex]?.quitYmd || this.user?.quitYmd;
    this.searchForm.get('joinYmd').patchValue(joinYmd);
    this.searchForm.get('quitYmd').patchValue(quitYmd);
  }

}
