import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PayslipStore } from './payslip.store';
import { HttpService } from '@app/shared/services';
import { GetPayslipRequestDTO, PayslipResponseDTO, PayslipResultDTO, SavePayslipRequestDTO } from './payslip.model';
import { WorkHistoryResultDTO } from '@app/work-history/work-history.model';
import { dateUtil, isEmpty, isNotBlank, numberWithCommas } from '@app/shared/utils';

@Injectable({ providedIn: 'root' })
export class PayslipService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private payslipStore: PayslipStore,
  ) {}

  /** 급여명세서 목록을 조회한다. */
  listPayslip$(dto?: GetPayslipRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<PayslipResponseDTO>('/sa/payslips', { params });
  }

  /** 급여명세서를 조회한다. */
  getPayslip$(dto?: GetPayslipRequestDTO) {
    const params = this.httpService.createParams(dto);
    const { payslipId } = dto;
    return this.http.get<PayslipResponseDTO>(`/sa/payslips/${payslipId}`, { params });
  }

  /** 급여명세서를 추가한다. */
  addPayslip$(dto?: SavePayslipRequestDTO) {
    return this.http.post<PayslipResponseDTO>('/sa/payslips', dto);
  }

  /** 급여명세서를 수정한다. */
  updatePayslip$(dto?: SavePayslipRequestDTO) {
    const { payslipId } = dto;
    return this.http.put<PayslipResponseDTO>(`/sa/payslips/${payslipId}`, dto);
  }

  /** 급여명세서를 삭제한다. */
  removePayslip$(payslipId: number) {
    return this.http.delete<void>(`/sa/payslips/${payslipId}`);
  }

  /** 근무이력 ID 값을 설정한다. */
  setWorkHistoryId(value: number): void {
    this.payslipStore.update('payslipWorkHistoryId', value);
  }

  /** 테이블 문구를 설정한다. */
  setPayslipTableContent(index: number, currentPayslip: PayslipResultDTO, isBackMode: boolean): void {
    const workHistory = this.payslipStore.select<WorkHistoryResultDTO[]>('payslipWorkHistoryList').value[index];
    const { quitYmd } = workHistory;

    this.payslipStore.update('payslipTableTitle', (() => {
      if (isEmpty(currentPayslip)) {
        return `<span class="${isBackMode ? 'blur' : ''}">급여명세서를 등록해보세요!</span>`;
      }

      if (isNotBlank(quitYmd)) {
        return `
          <div class="${isBackMode ? 'blur' : ''}">최근 급여:
            <span class="text-primary">${numberWithCommas(currentPayslip?.totalAmount)}원</span>
            <span>(${dateUtil(currentPayslip?.payslipPaymentYmd).format('YYYY년 MM월 DD일')})</span>
          </div>
        `;
      }
      return `${dateUtil(currentPayslip?.payslipPaymentYmd).format('YYYY년 MM월')} 급여: <span class="text-primary ${isBackMode ? 'blur' : ''}">${numberWithCommas(currentPayslip?.totalAmount)}원</span>`;
    })());

    this.payslipStore.update('payslipTableText', (() => {
      if (isEmpty(currentPayslip)) {
        return `<span class="${isBackMode ? 'blur' : ''}">급여명세서를 등록하면 급여내역을 한 눈에 확인할 수 있어요.</span>`;
      }

      return `<span class="${isBackMode ? 'blur' : ''}">자세한 급여내역은 항목을 클릭해서 확인할 수 있어요.</span>`;
    })());
  }

}
