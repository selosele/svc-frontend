import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreBaseComponent } from '@app/shared/components/core';
import { PayslipStore } from '@app/payslip/payslip.store';
import { PayslipService } from '@app/payslip/payslip.service';
import { GetPayslipRequestDTO, PayslipDataStateDTO, PayslipResponseDTO } from '@app/payslip/payslip.model';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { dateUtil, numberWithCommas } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTableComponent,
    UiButtonComponent,
  ],
  selector: 'salary-payslip-list',
  templateUrl: './salary-payslip-list.component.html',
  styleUrl: './salary-payslip-list.component.scss'
})
export class SalaryPayslipListComponent extends CoreBaseComponent implements OnInit {

  constructor(
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

  /** 테이블 선택된 행 */
  selection: PayslipResponseDTO;

  /** 테이블 다운로드 파일명 */
  fileName: string;

  /** 테이블 엑셀 다운로드 헤더 */
  excelHeader = [
    { 'payslipPaymentYmd': '지급일자' },
    { 'payslipNote'      : '비고' },
  ];

  /** 테이블 컬럼 */
  cols = [
    { field: 'totalAmountA00',       header: '지급총액',
      valueGetter: (data: PayslipResponseDTO) => `${data.totalAmountA00}원(+)`
    },
    { field: 'totalAmountB00',       header: '공제합계',
      valueGetter: (data: PayslipResponseDTO) => `${data.totalAmountB00}원(-)`
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
    this.payslipStore.select<number>('payslipWorkHistoryId').asObservable().subscribe((data) => {
      if (!data) return;
      
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

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {

  }
  
  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listPayslip({ workHistoryId: this.workHistoryId, userId: this.user?.userId });
    this.refresh.emit();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    
  }

  /** 급여명세서를 추가한다. */
  addPayslip(): void {

  }

}
