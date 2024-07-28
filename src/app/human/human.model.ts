/** 직원 응답 DTO */
export class EmployeeResponseDTO {

  /** 직원 ID */
  employeeId?: number;

  /** 직원 명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 직원 회사 정보 */
  employeeCompanies?: EmployeeCompanyResponseDTO[];

  /** 직원 부서 목록 */
  departments?: DepartmentResponseDTO[];

}

/** 직원 회사 응답 DTO */
export class EmployeeCompanyResponseDTO {

  /** 회사 ID */
  companyId?: number;

  /** 법인 명 */
  corporateName?: string;

  /** 회사 명 */
  companyName?: string;

}

/** 부서 응답 DTO */
export class DepartmentResponseDTO {

  /** 부서 ID */
  departmentId?: number;

  /** 회사 ID */
  companyId?: number;

  /** 상위 부서 ID */
  upDepartmentId?: number;

  /** 부서 명 */
  departmentName?: string;

  /** 부서 순서 */
  departmentOrder?: number;

  /** 직급 코드 */
  rankCode?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

}
