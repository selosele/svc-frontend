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

/** Open API로 조회한 회사 응답 DTO */
export class CompanyOpenAPIResponseDTO {

  /** 법인등록번호 */
  crno?: string;

  /** 법인의 명칭 */
  corpNm?: string;

  /** 법인의 영문 표기 명 */
  corpEnsnNm?: string;

  /** 기업 공시 회사의 이름 */
  enpPbanCmpyNm?: string;

  /** 기업 대표자의 이름 */
  enpRprFnm?: string;

  /** 법인이 어느 시장에 등록되었는지를 관리하는 코드 */
  corpRegMrktDcd?: string;

  /** 법인이 어느 시장에 등록되었는지를 관리하는 코드의 명칭 */
  corpRegMrktDcdNm?: string;

  /** 법인등록번호(5,6 자리)내 법인종류별분류번호(5,6 자리) */
  corpDcd?: string;

  /** 법인구분코드명 */
  corpDcdNm?: string;

  /** 세무에서, 신규로 개업하는 사업자에게 부여하는 사업체의 고유번호 */
  bzno?: string;

  /** 기업의 소재지 구우편번호 (6자리) */
  enpOzpno?: string;

  /** 기업의 소재지로 우편번호에 대응되는 기본주소 */
  enpBsadr?: string;

  /** 기업의 소재지로 우편번호에 대응되는 기본주소외의 상세주소 */
  enpDtadr?: string;

  /** 기업의 홈페이지 주소 */
  enpHmpgUrl?: string;

  /** 기업의 전화번호 */
  enpTlno?: string;

  /** 기업의 팩스 번호 */
  enpFxno?: string;

  /** 산업 주체들이 모든 산업활동을 그 성질에 따라 유형화한 분류 이름 */
  sicNm?: string;

  /** 기업의 설립일자 */
  enpEstbDt?: string;

  /** 기업의 결산 월 */
  enpStacMm?: string;

  /** 기업의 거래소 상장 일자 */
  enpXchgLstgDt?: string;

  /** 기업의 거래소 상장 폐지 일자 */
  enpXchgLstgAbolDt?: string;

  /** 기업의 주식이 코스닥 시장에 상장 등록된 일자 */
  enpKosdaqLstgDt?: string;

  /** 기업의 주식이 코스닥 시장에 상장 페지된 일자 */
  enpKosdaqLstgAbolDt?: string;

  /** 기업의 KONEX(자본시장을 통한 초기 중소기업 지원을 강화하여 창조경제 생태계 기반을 조성하기 위해 개설된 중소기업전용 주식시장) 상장 일자 */
  enpKrxLstgDt?: string;

  /** 기업의 KONEX(자본시장을 통한 초기 중소기업 지원을 강화하여 창조경제 생태계 기반을 조성하기 위해 개설된 중소기업전용 주식시장) 상장 폐지 일자 */
  enpKrxLstgAbolDt?: string;

  /** 해당 기업이 중소기업인지를 관리하는 여부 */
  smenpYn?: string;

  /** 기업의 주거래 은행 명칭 */
  enpMntrBnkNm?: string;

  /** 기업의 종업원 인원수 */
  enpEmpeCnt?: string;

  /** 기업의 종업원의 평균 근속 년수 */
  empeAvgCnwkTermCtt?: string;

  /** 기업의 1인 평균 급여 금액 */
  enpPn1AvgSlryAmt?: string;

  /** 회계 감사를 실시한 감사인의 명칭 */
  actnAudpnNm?: string;

  /** 회계감사에 대한 감사인의 의견 */
  audtRptOpnnCtt?: string;

  /** 기업이 영위하고 있는 주요 사업의 명칭 */
  enpMainBizNm?: string;

  /** 금융감독원에서 관리하는 법인의 고유번호 */
  fssCorpUnqNo?: string;

  /** 금융감독원에서 관리하는 법인 정보의 변경일시 */
  fssCorpChgDtm?: string;

  /** 최초개방일자 */
  fstOpegDt?: string;

  /** 최종개방일자 */
  lastOpegDt?: string;

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

  /** 근무이력 ID */
  workHistoryId?: number;
  
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

  /** 근무이력 ID */
  workHistoryId?: number;

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
