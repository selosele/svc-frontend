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

/** 급여명세서 조회 결과 DTO */
export class PayslipResultDTO {

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
  
  /** 입사일자 */
  joinYmd?: string;
  
  /** 급여명세서 지급내역 총 금액 */
  totalAmountA00?: string;
  
  /** 급여명세서 공제내역 총 금액 */
  totalAmountB00?: string;
  
  /** 급여명세서 실지급액(지급내역-공제내역) */
  totalAmount?: string;
  
  /** 이전/다음 급여명세서 flag */
  prevNextFlag?: string;

}

/** 급여명세서 급여내역 상세 조회 결과 DTO */
export class PayslipDetailResultDTO {

  /** 급여내역 상세 ID */
  salaryId?: number;

  /** 급여명세서 ID */
  payslipId?: number;

  /** 급여내역 구분 코드 */
  salaryTypeCode?: string;

  /** 급여내역 구분 코드명 */
  salaryTypeCodeName?: string;
  
  /** 급여내역 금액 코드 */
  salaryAmountCode?: string;
  
  /** 급여내역 금액 코드명 */
  salaryAmountCodeName?: string;
  
  /** 급여내역 금액 */
  salaryAmount?: string;

}

/** 급여명세서 응답 DTO */
export class PayslipResponseDTO {

  /** 급여명세서 */
  payslip?: PayslipResultDTO;

  /** 급여내역 상세 */
  payslipDetail?: PayslipDetailResultDTO;

  /** 급여명세서 목록 */
  payslipList?: PayslipResultDTO[];

}

/** 급여명세서 상태관리 DTO */
export class PayslipDataStateDTO {

  /** 근무이력 탭별 급여명세서 목록 및 데이터 로드 완료 여부 */
  [key: number]: {
    data: PayslipResponseDTO,
    dataLoad: boolean,
  };

}
