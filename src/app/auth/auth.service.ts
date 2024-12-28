import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StoreService, UiDialogService } from '@app/shared/services';
import { ACCESS_TOKEN_KEY, LOGIN_PAGE_PATH, SAVE_USER_ACCOUNT_KEY, isNotBlank } from '@app/shared/utils';
import { AuthenticatedUser, LoginRequestDTO, LoginResponseDTO, FindUserInfoRequestDTO, UserCertHistoryResponseDTO } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private router: Router,
    private store: StoreService,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private dialogService: UiDialogService,
  ) {}

  /** 사용자 본인인증 내역 */
  private userCertHistory = this.store.create<UserCertHistoryResponseDTO>('userCertHistory', null);

  /** 로그인을 한다. */
  login(dto: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/co/auth/login', dto)
    .subscribe((data) => {
      const accessToken = data.accessToken;
      if (isNotBlank(accessToken)) {
        
        // 액세스 토큰 설정
        this.setAccessToken(accessToken);

        // 아이디 저장 여부 값에 따른 설정
        if (dto.saveUserAccountYn[0] === 'Y') {
          this.setSaveUserAccount(dto.userAccount);
        } else {
          this.removeSaveUserAccount();
        }

        // 메인 화면으로 이동
        this.router.navigateByUrl('/');
      }
    });
  }

  /** 특정 사용자로 로그인한다. */
  superLogin(dto: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/co/auth/superlogin', dto)
    .subscribe(async (data) => {
      const accessToken = data.accessToken;
      if (isNotBlank(accessToken)) {

        // 로그인 정보 삭제
        this.clearAuthInfo();
        
        // 액세스 토큰 설정
        this.setAccessToken(accessToken);

        // 메인 화면으로 이동
        await this.router.navigateByUrl('/');
        window.location.reload();
      }
    });
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.http.post<void>('/co/auth/logout', {})
    .subscribe(() => {
      this.clearAuthInfo();
      this.router.navigateByUrl(LOGIN_PAGE_PATH);
    });
  }

  /** 로그인 정보를 삭제한다. */
  clearAuthInfo(): void {
    this.removeAccessToken();
    this.dialogService.closeAllDialog();

    Object.keys(window.localStorage).forEach((key) => {
      if (key !== SAVE_USER_ACCOUNT_KEY) {
        window.localStorage.removeItem(key); // 필수로 저장되어 있어야 하는 key를 제외하고 전부 삭제
      }
    });

    this.store.resetAll(); // 모든 상태를 초기화
  }

  /** 사용자의 아이디를 찾는다. */
  findUserAccount$(dto: FindUserInfoRequestDTO) {
    return this.http.post<boolean>('/co/auth/find-user-account', dto);
  }

  /** 사용자의 비밀번호를 찾는다(인증코드 발송). */
  findUserPassword1$(dto: FindUserInfoRequestDTO) {
    return this.http.post<UserCertHistoryResponseDTO>('/co/auth/find-user-password1', dto);
  }

  /** 사용자의 비밀번호를 찾는다(임시 비밀번호 발급). */
  findUserPassword2$(dto: FindUserInfoRequestDTO) {
    return this.http.post<boolean>('/co/auth/find-user-password2', dto);
  }

  /** 로그인 여부를 반환한다. */
  isLogined(): boolean {
    const accessToken = this.getAccessToken();
    if (isNotBlank(accessToken) && this.isTokenValid(accessToken)) {
      return true;
    }
    return false;
  }

  /** 인증된 사용자 정보를 반환한다. */
  getAuthenticatedUser(): AuthenticatedUser {
    return this.jwtHelper.decodeToken<AuthenticatedUser>(this.getAccessToken());
  }

  /** 1개의 권한을 가지고 있는지 여부를 반환한다. */
  hasRole(roleId: string): boolean {
    const user = this.getAuthenticatedUser();
    if (!user) return false;
    for (const userRoleId of user.roles) {
      if (roleId === userRoleId) return true;
    }
    return false;
  }

  /** 모든 권한을 가지고 있는지 여부를 반환한다. */
  hasRoleAll(...roleIds: string[]): boolean {
    const user = this.getAuthenticatedUser();
    if (!user) return false;
    return roleIds.every(roleId => user.roles.filter(userRoleId => userRoleId === roleId).length > 0);
  }

  /** 권한을 1개라도 가지고 있는지 여부를 반환한다. */
  hasRoleOr(...roleIds: string[]): boolean {
    const user = this.getAuthenticatedUser();
    if (!user) return false;
    return roleIds.some(roleId => user.roles.filter(userRoleId => userRoleId === roleId).length > 0);
  }

  /** 액세스 토큰을 반환한다. */
  getAccessToken(): string {
    return this.jwtHelper.tokenGetter() as string;
  }

  /** 액세스 토큰을 설정한다. */
  setAccessToken(accessToken: string): void {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  /** 액세스 토큰을 삭제한다. */
  removeAccessToken(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  /** 유효한 JWT인지 확인한다. */
  isTokenValid(token: string): boolean {
    return !this.isTokenExpired(token);
  }

  /** JWT 만료 여부를 반환한다. */
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  /** 로컬스토리지에 저장된 아이디 저장 여부 값을 반환한다. */
  getSavedUserAccount(): string {
    return window.localStorage.getItem(SAVE_USER_ACCOUNT_KEY);
  }

  /** 아이디 저장 여부 값을 설정한다. */
  setSaveUserAccount(userAccount: string): void {
    window.localStorage.setItem(SAVE_USER_ACCOUNT_KEY, userAccount);
  }

  /** 아이디 저장 여부 값을 삭제한다. */
  removeSaveUserAccount(): void {
    window.localStorage.removeItem(SAVE_USER_ACCOUNT_KEY);
  }

}
