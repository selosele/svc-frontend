/** 로그인 요청 DTO */
export interface LoginRequestDTO {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

}

/** 로그인 응답 DTO */
export interface LoginResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}
