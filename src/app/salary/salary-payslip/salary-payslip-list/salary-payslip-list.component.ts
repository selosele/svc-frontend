import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableRowSelectEvent } from 'primeng/table';
import { CoreBaseComponent } from '@app/shared/components/core';
import { PayslipStore } from '@app/payslip/payslip.store';
import { PayslipService } from '@app/payslip/payslip.service';
import { UiDialogService, UiLoadingService } from '@app/shared/services';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { GetPayslipRequestDTO, PayslipDataStateDTO, PayslipResponseDTO, PayslipResultDTO } from '@app/payslip/payslip.model';
import { WorkHistoryResultDTO } from '@app/work-history/work-history.model';
import { UiButtonComponent, UiSkeletonComponent, UiTableComponent } from '@app/shared/components/ui';
import { UiDateFieldComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { dateUtil } from '@app/shared/utils';
import { SalaryPayslipDetailComponent } from '../salary-payslip-detail/salary-payslip-detail.component';
import { SaveSalaryPayslipComponent } from '../save-salary-payslip/save-salary-payslip.component';

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
    private route: ActivatedRoute,
    private payslipStore: PayslipStore,
    private payslipService: PayslipService,
    private dialogService: UiDialogService,
    private loadingService: UiLoadingService,
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
  get payslipResponse() {
    const list = this.payslipStore.select<PayslipDataStateDTO>('payslipResponse').value;
    return list?.[this.workHistoryId]?.data ?? null;
  }

  /** 급여명세서 목록 데이터 로드 완료 여부 */
  get payslipResponseDataLoad() {
    const list = this.payslipStore.select<PayslipDataStateDTO>('payslipResponse').value;
    return list?.[this.workHistoryId]?.dataLoad ?? false;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.payslipStore.select<WorkHistoryResultDTO[]>('payslipWorkHistoryList').value;
  }

  /** 선택된 회사 탭의 index */
  get activeIndex() {
    return this.payslipStore.select<number>('payslipWorkHistoryTabIndex').value;
  }

  /** 급여내역 구분 코드 데이터 목록 */
  salaryTypecodes: DropdownData[];

  /** 지급내역 금액 코드 데이터 목록 */
  salaryAmountA00Codes: DropdownData[];

  /** 공제내역 금액 코드 데이터 목록 */
  salaryAmountB00Codes: DropdownData[];

  /** 직위 코드 데이터 목록 */
  rankCodes: DropdownData[];

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
      valueGetter: (data: PayslipResultDTO) => `+${data.totalAmountA00}원`
    },
    { field: 'totalAmountB00',       header: '공제합계',
      valueGetter: (data: PayslipResultDTO) => `-${data.totalAmountB00}원`
    },
    { field: 'totalAmount',          header: '실지급액(지급총액-공제합계)',
      valueGetter: (data: PayslipResultDTO) => `<strong>${data.totalAmount}원</strong>`
    },
    { field: 'payslipPaymentYmd',    header: '지급일자',
      valueGetter: (data: PayslipResultDTO) => `${dateUtil(data.payslipPaymentYmd).format('YYYY년 MM월 DD일')}`
    },
    { field: 'payslipNote',          header: '비고' },
  ];

  ngOnInit(): void {
    this.route.data.subscribe(({ code }) => {
      this.salaryTypecodes = code['SALARY_TYPE_00'];
      this.salaryAmountA00Codes = code['SALARY_AMOUNT_A00'];
      this.salaryAmountB00Codes = code['SALARY_AMOUNT_B00'];
      this.rankCodes = code['RANK_00'];
    });

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
      
      if (!this.payslipResponseDataLoad) {
        this.listPayslip({ workHistoryId: data, userId: this.user?.userId });
      }
    });
  }

  /** 급여명세서 목록을 조회한다. */
  listPayslip(dto: GetPayslipRequestDTO): void {
    const { workHistoryId } = dto;

    this.payslipService.listPayslip$(dto)
    .subscribe((response) => {
      const oldValue = this.payslipStore.select<PayslipDataStateDTO>('payslipResponse').value;
      this.payslipStore.update('payslipResponse', {
        ...oldValue,
        [workHistoryId]: { data: response, dataLoad: true } // 근무이력 탭별로 급여명세서 목록을 상태관리
      });
    });
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: TableRowSelectEvent): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    this.payslipService.getPayslip$({
      payslipId: event.data['payslipId'],
      workHistoryId: this.workHistoryId,
      userId: this.user?.userId
    })
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);
  
      this.dialogService.open(SalaryPayslipDetailComponent, {
        focusOnShow: false,
        header: '급여명세서 조회',
        width: '1000px',
        data: response,
      });
    });
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
    this.dialogService.open(SaveSalaryPayslipComponent, {
      focusOnShow: false,
      header: '급여명세서 입력하기',
      width: '1000px',
      data: {
        workHistoryId: this.workHistoryId,
        salaryTypecodes: this.salaryTypecodes,
        salaryAmountA00Codes: this.salaryAmountA00Codes,
        salaryAmountB00Codes: this.salaryAmountB00Codes,
        rankCodes: this.rankCodes,
      },
    });
  }

}
