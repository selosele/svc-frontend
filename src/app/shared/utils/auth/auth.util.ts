/** 로그인 페이지 PATH */
export const LOGIN_PAGE_PATH = '/auth/login';

/** 액세스 토큰 명 */
export const ACCESS_TOKEN_NAME = 'accessToken';

/** JwtHelperService 설정을 위한 옵션 제공자 */
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => window.localStorage.getItem(ACCESS_TOKEN_NAME),
  };
}

/** 권한 ID */
export const roles = {

  /** 시스템 관리자 권한 */
  systemAdmin: 'ROLE_SYSTEM_ADMIN',

  /** 직원 권한 */
  employee: 'ROLE_EMPLOYEE',

};
