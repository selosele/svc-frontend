import { Transform } from 'class-transformer';
import { HttpRequestDTOBase } from '@app/shared/models';
import { isNotEmpty } from '@app/shared/utils';

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

  /** 급여명세서 지급일자 */
  payslipPaymentYmd?: string;

  /** 급여명세서 지급 연도 */
  payslipPaymentYYYY?: string;

  /** 급여명세서 지급 월 */
  payslipPaymentMM?: string;

  /** 최신 급여명세서 조회 여부 (Y/N) */
  isGetCurrent?: string;

}

/** 급여명세서 추가/수정 요청 DTO */
export class SavePayslipRequestDTO extends HttpRequestDTOBase {

  /** 급여명세서 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  payslipId?: number;

  /** 사용자 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  userId?: number;

  /** 직원 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  employeeId?: number;

  /** 근무이력 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  workHistoryId?: number;

  /** 급여명세서 지급일자 */
  payslipPaymentYmd?: string;

  /** 급여명세서 비고 */
  payslipNote?: string;

  /** 직위 코드 */
  rankCode?: string;

  /** 급여명세서 급여내역 상세 */
  payslipSalaryDetailList?: AddPayslipSalaryDetailRequestDTO[];

}

/** 급여명세서 급여내역 상세 추가 요청 DTO */
export class AddPayslipSalaryDetailRequestDTO extends HttpRequestDTOBase {

  /** 급여내역 구분 코드 */
  salaryTypeCode?: string;
  
  /** 급여내역 금액 코드 */
  salaryAmountCode?: string;
  
  /** 급여내역 금액 */
  salaryAmount?: string;

}

/** 급여명세서 조회 결과 DTO */
export class PayslipResultDTO {

  /** 급여명세서 ID */
  payslipId?: number;
  
  /** 사용자 ID */
  userId?: number;
  
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
  
  /** 회사명 */
  companyName?: string;
  
  /** 급여명세서 지급내역 총 금액 */
  totalAmountA00?: number;
  
  /** 급여명세서 공제내역 총 금액 */
  totalAmountB00?: number;

  /** 이전 달 지급내역 총 금액 */
  prevTotalAmountA00?: number;
  
  /** 이전 달 공제내역 총 금액 */
  prevTotalAmountB00?: number;
  
  /** 이전 달 총 금액 차이 */
  totalAmountCompare?: number;
  
  /** 이전 달 총 금액 차이 퍼센테이지 */
  totalAmountComparePercent?: number;

  /** 이전 달 지급내역 금액 차이 */
  totalAmountCompareA00?: number;

  /** 이전 달 공제내역 금액 차이 */
  totalAmountCompareB00?: number;

  /** 이전 달 지급내역 금액 차이 퍼센테이지 */
  totalAmountComparePercentA00?: number;

  /** 이전 달 공제내역 금액 차이 퍼센테이지 */
  totalAmountComparePercentB00?: number;
  
  /** 급여명세서 실지급액(지급내역-공제내역) */
  totalAmount?: number;
  
  /** 이전/다음 급여명세서 flag */
  prevNextFlag?: string;

  /** 급여명세서 급여내역 상세 */
  payslipSalaryDetailList?: PayslipSalaryDetailResultDTO[];

}

/** 급여명세서 급여내역 상세 조회 결과 DTO */
export class PayslipSalaryDetailResultDTO {

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
  salaryAmount?: number;
  
  /** 이전 달 급여내역 금액 */
  prevSalaryAmount?: number;
  
  /** 이전 달 급여내역 금액 차이 */
  salaryAmountCompare?: number;
  
  /** 이전 달 급여내역 금액 차이 퍼센테이지 */
  salaryAmountComparePercent?: number;

}

/** 급여명세서 응답 DTO */
export class PayslipResponseDTO {

  /** 급여명세서 */
  payslip?: PayslipResultDTO;

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
