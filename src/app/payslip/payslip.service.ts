import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PayslipStore } from './payslip.store';
import { HttpService } from '@app/shared/services';
import { GetPayslipRequestDTO, PayslipResponseDTO } from './payslip.model';

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
    return this.http.get<PayslipResponseDTO[]>('/sa/payslips', { params });
  }

  /** 급여명세서를 조회한다. */
  getPayslip$(payslipId: number) {
    return this.http.get<PayslipResponseDTO>(`/sa/payslips/${payslipId}`);
  }

  /** 근무이력 ID 값을 설정한다. */
  setWorkHistoryId(value: number): void {
    this.payslipStore.update('payslipWorkHistoryId', value);
  }

  /** 테이블 문구를 설정한다. */
  setPayslipTableContent(index: number): void {
    this.payslipStore.update('payslipTableTitle', '이번 달 급여: 0,000,000원');
    this.payslipStore.update('payslipTableText', '자세한 급여내역은 항목을 클릭해서 확인할 수 있어요.');
  }

}
