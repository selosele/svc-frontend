/** 로그인 페이지 PATH */
export const LOGIN_PAGE_PATH = '/auth/login';

/** 액세스 토큰 저장 key */
export const ACCESS_TOKEN_KEY = 'accessToken';

/** 로그인 시 아이디 저장 key */
export const SAVE_USER_ACCOUNT_KEY = 'savedUserAccount';

/** JwtHelperService 설정을 위한 옵션 제공자 */
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => window.localStorage.getItem(ACCESS_TOKEN_KEY),
  };
}

/** 권한 ID 목록 */
export const roles = {

  /** 시스템 관리자 권한 */
  SYSTEM_ADMIN: 'ROLE_SYSTEM_ADMIN',

  /** 직원 권한 */
  EMPLOYEE: 'ROLE_EMPLOYEE',

};
