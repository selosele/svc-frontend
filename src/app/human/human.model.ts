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

  /** 직원 부서 정보 */
  department?: SaveDepartmentRequestDTO;

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

/** 직원 회사 추가/수정 요청 DTO */
export class SaveEmployeeCompanyRequestDTO extends HttpRequestDTOBase {

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

/** 부서 조회 요청 DTO */
export class GetDepartmentRequestDTO extends HttpRequestDTOBase {

  /** 직원 ID */
  employeeId?: number;

  /** 회사 ID */
  companyId?: number;

  /** 회사별 조회 여부 */
  getByCompanyYn?: string;

}

/** 부서 추가/수정 요청 DTO */
export class SaveDepartmentRequestDTO extends HttpRequestDTOBase {

  /** 부서 ID */
  departmentId?: number;

  /** 직급 코드 */
  rankCode?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

}

/** 부서 응답 DTO */
export class DepartmentResponseDTO {

  /** 부서 ID */
  departmentId?: number;

  /** 회사 ID */
  companyId?: number;

  /** 회사명 */
  companyName?: string;

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

/** 부서 트리 */
export class DepartmentTree extends DepartmentResponseDTO {

  /** 부서 */
  data?: DepartmentResponseDTO;

  /** 하위 부서 목록 */
  children?: DepartmentTree[];

  /** 확장 여부 */
  expanded?: boolean = false;

}
