import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ACCESS_TOKEN_NAME, isNotBlank } from '@app/shared/utils';
import { LoginRequestDTO, LoginResponseDTO } from './auth.dto';
import { UserResponseDTO } from '@app/shared/models';
import { MenuService } from '@app/shared/services';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private menuService: MenuService,
  ) {}

  /** 로그인을 한다. */
  login(loginRequestDTO: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/auth/login', loginRequestDTO)
    .subscribe(data => {
      const accessToken = data.accessToken;
      if (isNotBlank(accessToken)) {
        this.setAccessToken(accessToken);
        this.router.navigateByUrl('/');
      }
    });
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.http.post<void>('/auth/logout', {})
    .subscribe(() => {
      this.removeAccessToken();
      this.clearAllState();
      this.router.navigateByUrl('/auth/login');
    });
  }

  /** 로그인 여부를 반환한다. */
  isLogined(): boolean {
    const accessToken = this.getAccessToken();
    if (isNotBlank(accessToken) && this.isTokenValid(accessToken))
      return true;

    return false;
  }

  /** 인증된 사용자 정보를 반환한다. */
  getAuthenticatedUser(): UserResponseDTO {
    return this.jwtHelper.decodeToken<UserResponseDTO>(this.getAccessToken());
  }

  /** 액세스 토큰을 반환한다. */
  getAccessToken(): string {
    return this.jwtHelper.tokenGetter() as string;
  }

  /** 액세스 토큰을 설정한다. */
  setAccessToken(accessToken: string): void {
    window.localStorage.setItem(ACCESS_TOKEN_NAME, accessToken);
  }

  /** 액세스 토큰을 삭제한다. */
  removeAccessToken(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_NAME);
  }

  /** 유효한 JWT인지 확인한다. */
  isTokenValid(token: string): boolean {
    return !this.isTokenExpired(token);
  }

  /** JWT 만료 여부를 반환한다. */
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  /** 모든 상태를 초기화한다. */
  clearAllState(): void {
    // TODO: 로그아웃 시 상태 초기화 필수
    this.menuService.setMenuList([]);
  }

}
