import { HttpRequestDTOBase } from '@app/shared/models';

/** 급여명세서 조회 요청 DTO */
export class GetPayslipRequestDTO extends HttpRequestDTOBase {

  /** 급여명세서 ID */
  payslipId?: number;

  /** 사용자 ID */
  userId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 급여명세서 지급 연도 */
  payslipPaymentYYYY?: string;

  /** 급여명세서 지급 월 */
  payslipPaymentMM?: string;

}

/** 급여명세서 응답 DTO */
export class PayslipResponseDTO {

  /** 급여명세서 ID */
  payslipId?: number;
  
  /** 직원 ID */
  employeeId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 급여명세서 지급일자 */
  payslipPaymentYmd?: string;
  
  /** 급여명세서 비고 */
  payslipNote?: string;
  
  /** 직위 코드 */
  rankCode?: string;
  
  /** 직위 코드명 */
  rankCodeName?: string;
  
  /** 급여명세서 지급내역 총 금액 */
  totalAmountA00?: string;
  
  /** 급여명세서 공제내역 총 금액 */
  totalAmountB00?: string;
  
  /** 급여명세서 실지급액(지급내역-공제내역) */
  totalAmount?: string;

}

/** 급여명세서 상태관리 DTO */
export class PayslipDataStateDTO {

  /** 근무이력 탭별 급여명세서 목록 및 데이터 로드 완료 여부 */
  [key: number]: {
    data: PayslipResponseDTO[],
    dataLoad: boolean,
  };

}
