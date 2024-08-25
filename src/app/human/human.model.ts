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
  phoneNumber?: string;

  /** 직원 회사 정보 */
  employeeCompany?: SaveEmployeeCompanyRequestDTO;

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
  phoneNumber?: string;

  /** 직원 회사 정보 */
  employeeCompanies?: EmployeeCompanyResponseDTO[];

}

/** 직원 회사 추가/수정 요청 DTO */
export class SaveEmployeeCompanyRequestDTO extends HttpRequestDTOBase {

  /** 직원 회사 ID */
  employeeCompanyId?: number;

  /** 직원 ID */
  employeeId?: number;
  
  /** 회사 ID */
  companyId?: number;

  /** 직급 코드 */
  rankCode?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 입사일자 */
  joinYmd?: string;

  /** 퇴사일자 */
  quitYmd?: string;

}

/** 직원 회사 응답 DTO */
export class EmployeeCompanyResponseDTO {

  /** 직원 회사 ID */
  employeeCompanyId?: number;
  
  /** 회사 ID */
  companyId?: number;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 입사일자 */
  joinYmd?: string;

  /** 퇴사일자 */
  quitYmd?: string;

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

  /** 직원 회사 ID */
  employeeCompanyId?: number;

}

/** 휴가 추가/수정 요청 DTO */
export class SaveVacationRequestDTO extends HttpRequestDTOBase {

  /** 휴가 ID */
  vacationId?: number;

  /** 직원 회사 ID */
  employeeCompanyId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 휴가 내용 */
  vacationContent?: string;

}

/** 휴가 응답 DTO */
export class VacationResponseDTO {

  /** 휴가 ID */
  vacationId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 직원 회사 ID */
  employeeCompanyId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 내용 */
  vacationContent?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 삭제 여부 */
  deleteYn?: string;

}
