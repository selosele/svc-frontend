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
