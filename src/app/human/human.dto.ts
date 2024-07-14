/** 직원 응답 DTO */
export interface EmployeeResponseDTO {

  /** 직원 ID */
  employeeId?: number;

  /** 직원 명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 성별 코드 명 */
  genderCodeName?: string;

  /** 직원 회사 정보 */
  employeeCompany?: EmployeeCompanyResponseDTO;

}

/** 직원 회사 응답 DTO */
export interface EmployeeCompanyResponseDTO {

  /** 회사 ID */
  companyId?: number;

  /** 법인 명 */
  corporateName?: string;

  /** 회사 명 */
  companyName?: string;

}
