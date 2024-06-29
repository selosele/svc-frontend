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

/** 사용자 응답 DTO */
export class UserResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 명 */
  userName?: string;

  /** 사용자 권한 목록 */
  roles?: string[];
    
}

