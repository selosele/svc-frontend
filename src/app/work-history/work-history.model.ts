import { HttpRequestDTOBase } from '@app/shared/models';

/** 근무이력 조회 요청 DTO */
export class GetWorkHistoryRequestDTO extends HttpRequestDTOBase {

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 회사 ID */
  companyId?: number;

  /** 연차발생기준 코드 */
  annualTypeCode?: string;

  /** 휴가 계산에 포함할 휴가 구분 코드 목록 */
  vacationTypeCodes?: string[];

}

/** 근무이력 추가/수정 요청 DTO */
export class SaveWorkHistoryRequestDTO extends HttpRequestDTOBase {

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 직원 ID */
  employeeId?: number;
  
  /** 회사 ID */
  companyId?: number;
  
  /** 사업자등록번호 */
  registrationNo?: string;
  
  /** 법인명 */
  corporateName?: string;
  
  /** 회사명 */
  companyName?: string;

  /** 직위 코드 */
  rankCode?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 입사일자 */
  joinYmd?: string;

  /** 퇴사일자 */
  quitYmd?: string;

}

/** 근무이력 응답 DTO */
export class WorkHistoryResponseDTO {

  /** 근무이력 ID */
  workHistoryId?: number;
  
  /** 회사 ID */
  companyId?: number;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 직위 코드 */
  rankCode?: string;

  /** 직위 코드명 */
  rankCodeName?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 직책 코드명 */
  jobTitleCodeName?: string;

  /** 연차발생기준 코드 */
  annualTypeCode?: string;

  /** 입사일자 */
  joinYmd?: string;

  /** 퇴사일자 */
  quitYmd?: string;

  /** 재직기간(연도) */
  workDiffY?: number;

  /** 재직기간(월) */
  workDiffM?: number;

  /** 총 월차 개수 */
  vacationTotalCountByJoinYmd?: number;

  /** 총 연차 개수 */
  vacationTotalCountByFiscalYear?: number;

  /** 잔여 월차 개수 */
  vacationRemainCountByJoinYmd?: number;

  /** 잔여 연차 개수 */
  vacationRemainCountByFiscalYear?: number;

}
