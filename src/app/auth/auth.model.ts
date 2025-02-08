import { HttpRequestDTOBase } from '@app/shared/models';

/** 로그인 요청 DTO */
export class LoginRequestDTO extends HttpRequestDTOBase {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

  /** 아이디 저장 여부 */
  saveUserAccountYn?: string[];

}

/** 로그인 응답 DTO */
export class LoginResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}

/** 사용자 아이디/비밀번호 찾기 요청 DTO */
export class FindUserInfoRequestDTO extends HttpRequestDTOBase {

  /** 사용자 계정 */
  userAccount?: string;

  /** 직원명 */
  employeeName?: string;

  /** 이메일주소 */
  emailAddr?: string;
    
}

/** 사용자 본인인증 이력 조회 요청 DTO */
export class GetUserCertHistoryRequestDTO extends HttpRequestDTOBase {

  /** 본인인증 이력 ID */
  certHistoryId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 본인인증 코드 */
  certCode?: string;

  /** 본인인증 방법 코드 */
  certMethodCode?: string;

  /** 본인인증 구분 코드 */
  certTypeCode?: string;
    
}

/** 사용자 본인인증 이력 조회 결과 DTO */
export class UserCertHistoryResultDTO {

  /** 직원명 */
  certHistoryId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 본인인증 코드 */
  certCode?: string;

  /** 본인인증 방법 코드 */
  certMethodCode?: string;

  /** 본인인증 구분 코드 */
  certTypeCode?: string;

  /** 유효시간(초) */
  validTime?: string;

  /** 등록일시 */
  createDt?: string;
    
}

/** 사용자 본인인증 이력 응답 DTO */
export class UserCertHistoryResponseDTO {

  /** 사용자 본인인증 이력 */
  userCertHistory?: UserCertHistoryResultDTO;

  /** 사용자 본인인증 이력 목록 */
  userCertHistoryList?: UserCertHistoryResultDTO[];
    
}

/** 인증된 사용자 정보 */
export class AuthenticatedUser {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 회사명 */
  companyName?: string;

  /** 직위 코드 */
  rankCode?: string;

  /** 직위 코드명 */
  rankCodeName?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 직책 코드명 */
  jobTitleCodeName?: string;

  /** 입사일자 */
  joinYmd?: string;

  /** 퇴사일자 */
  quitYmd?: string;

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 생년월일 */
  birthYmd?: string;

  /** 사용자 권한 목록 */
  roles?: string[];

}

