import { HttpRequestDTOBase } from '@app/shared/models';

/** 직원 수정 요청 DTO */
export class UpdateEmployeeRequestDTO extends HttpRequestDTOBase {

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

  /** 직원 부서 목록 */
  departments?: DepartmentResponseDTO[];

}

/** 직원 회사 응답 DTO */
export class EmployeeCompanyResponseDTO {

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

/** 부서 응답 DTO */
export class DepartmentResponseDTO {

  /** 부서 ID */
  departmentId?: number;

  /** 회사 ID */
  companyId?: number;

  /** 상위 부서 ID */
  upDepartmentId?: number;

  /** 부서명 */
  departmentName?: string;

  /** 부서 순서 */
  departmentOrder?: number;

  /** 직급 코드 */
  rankCode?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 삭제 여부 */
  deleteYn?: string;

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
  registrationNumber?: string;

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
  registrationNumber?: string;

  /** 삭제 여부 */
  deleteYn?: string;

}
