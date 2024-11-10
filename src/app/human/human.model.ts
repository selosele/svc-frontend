import { HttpRequestDTOBase } from '@app/shared/models';

/** 직원 추가/수정 요청 DTO */
export class SaveEmployeeRequestDTO extends HttpRequestDTOBase {

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 생년월일 */
  birthYmd?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 근무이력 정보 */
  workHistory?: SaveWorkHistoryRequestDTO;

}

/** 직원 응답 DTO */
export class EmployeeResponseDTO {

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 생년월일 */
  birthYmd?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 사용자 마지막 로그인 일시 */
  lastLoginDt?: string;

  /** 근무이력 정보 */
  workHistories?: WorkHistoryResponseDTO[];

}

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

  /** 잔여 휴가 개수 */
  vacationRemainCount?: number;

}

/** 회사 조회 요청 DTO */
export class GetCompanyRequestDTO extends HttpRequestDTOBase {

  /** 회사 ID */
  companyId?: number;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 사업자등록번호 */
  registrationNo?: string;

}

/** 회사 응답 DTO */
export class CompanyResponseDTO {

  /** 회사 ID */
  companyId?: number;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 삭제 여부 */
  deleteYn?: string;

}

/** 휴가 조회 요청 DTO */
export class GetVacationRequestDTO extends HttpRequestDTOBase {

  /** 휴가 ID */
  vacationId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

}

/** 휴가 추가/수정 요청 DTO */
export class SaveVacationRequestDTO extends HttpRequestDTOBase {

  /** 휴가 ID */
  vacationId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 휴가 내용 */
  vacationContent?: string;

  /** 휴가 사용일수 */
  vacationUseCount?: number;

}

/** 휴가 응답 DTO */
export class VacationResponseDTO {

  /** 휴가 ID */
  vacationId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 구분 코드명 */
  vacationTypeCodeName?: string;

  /** 휴가 내용 */
  vacationContent?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 휴가 사용일수 */
  vacationUseCount?: number;

  /** 삭제 여부 */
  deleteYn?: string;

}

/** 휴가 계산 설정 추가 요청 DTO */
export class AddVacationCalcRequestDTO extends HttpRequestDTOBase {

  /** 직원 ID */
  employeeId?: number;
  
  /** 휴가 내용 */
  annualTypeCode?: string;

  /** 휴가 구분 코드 목록 */
  vacationTypeCodes?: string[];

}

/** 휴가 계산 설정 응답 DTO */
export class VacationCalcResponseDTO {

  /** 휴가 계산 설정 ID */
  vacationCalcId?: number;

  /** 직원 ID */
  employeeId?: number;
  
  /** 휴가 내용 */
  annualTypeCode?: string;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

}

/** 탭별 휴가 목록 */
export interface VacationTabViewItem {

  /** key */
  key: number;

  /** 휴가 목록 */
  value: VacationResponseDTO[];

}
