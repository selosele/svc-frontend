import { HttpRequestDTOBase } from '@app/shared/models';

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

/** 회사 추가/수정 요청 DTO */
export class SaveCompanyRequestDTO extends HttpRequestDTOBase {

  /** 회사 ID */
  companyId?: number;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 회사 소재지 */
  companyAddr?: string;

  /** 대표자명 */
  ceoName?: string;

}

/** 회사 조회 결과 DTO */
export class CompanyResultDTO {

  /** 회사 ID */
  companyId?: number;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 회사 소재지 */
  companyAddr?: string;

  /** 대표자명 */
  ceoName?: string;

  /** 삭제 여부 */
  deleteYn?: string;

}

/** 회사 응답 DTO */
export class CompanyResponseDTO {

  /** 회사 */
  company?: CompanyResultDTO;

  /** 회사 목록 */
  companyList?: CompanyResultDTO[];

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

/** 회사등록신청 조회 요청 DTO */
export class GetCompanyApplyRequestDTO extends HttpRequestDTOBase {

  /** 회사등록신청 ID */
  companyApplyId?: number;

  /** 사업자등록번호 */
  registrationNo?: string;

}

/** 회사등록신청 추가/수정 요청 DTO */
export class SaveCompanyApplyRequestDTO extends HttpRequestDTOBase {

  /** 회사등록신청 ID */
  companyApplyId?: number;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 신청 내용 */
  applyContent?: string;

  /** 신청 상태 코드 */
  applyStateCode?: string;

  /** 신청자 ID */
  applicantId?: string;

  /** 반려 사유 */
  rejectContent?: string;

}

/** 회사등록신청 조회 결과 DTO */
export class CompanyApplyResultDTO {

  /** 회사등록신청 ID */
  companyApplyId?: number;

  /** 사업자등록번호 */
  registrationNo?: string;

  /** 법인명 */
  corporateName?: string;

  /** 회사명 */
  companyName?: string;

  /** 신청 내용 */
  applyContent?: string;

  /** 신청 상태 코드 */
  applyStateCode?: string;

  /** 신청 상태 코드명 */
  applyStateCodeName?: string;

  /** 신청자 ID */
  applicantId?: number;

  /** 신청자명 */
  applicantName?: string;

  /** 신청일시 */
  applyDt?: string;

  /** 반려 사유 */
  rejectContent?: string;

  /** 반려일시 */
  rejectDt?: string;

}

/** 회사등록신청 응답 DTO */
export class CompanyApplyResponseDTO {

  /** 회사등록신청 */
  companyApply?: CompanyApplyResultDTO;

  /** 회사등록신청 목록 */
  companyApplyList?: CompanyApplyResultDTO[];

}
