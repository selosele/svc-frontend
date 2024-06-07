/** 로그인 요청 DTO */
export interface SignInRequestDTO {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

}

/** 로그인 응답 DTO */
export interface SignInResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}
