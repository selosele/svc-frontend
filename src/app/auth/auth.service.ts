import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { ACCESS_TOKEN_NAME, LOGIN_PAGE_PATH, isNotBlank } from '@app/shared/utils';
import { AuthenticatedUser, LoginRequestDTO, LoginResponseDTO, RoleResponseDTO, UpdateUserRequestDTO, UserResponseDTO } from './auth.model';
import { StateService } from '@app/shared/services';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private stateService: StateService,
  ) {}

  userListSubject = new BehaviorSubject<UserResponseDTO[]>([]);
  userListDataLoadSubject = new BehaviorSubject<boolean>(false);
  roleListSubject = new BehaviorSubject<RoleResponseDTO[]>([]);
  roleListDataLoadSubject = new BehaviorSubject<boolean>(false);

  /** 사용자 목록 */
  userList$ = this.userListSubject.asObservable();

  /** 사용자 목록 데이터 로드 완료 여부 */
  userListDataLoad$ = this.userListDataLoadSubject.asObservable();

  /** 권한 목록 */
  roleList$ = this.roleListSubject.asObservable();

  /** 권한 목록 데이터 로드 완료 여부 */
  roleListDataLoad$ = this.roleListDataLoadSubject.asObservable();

  /** 로그인을 한다. */
  login(loginRequestDTO: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/common/auth/login', loginRequestDTO)
    .subscribe((data) => {
      const accessToken = data.accessToken;
      if (isNotBlank(accessToken)) {
        this.setAccessToken(accessToken);
        this.router.navigateByUrl('/');
      }
    });
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.http.post<void>('/common/auth/logout', {})
    .subscribe(() => {
      this.removeAccessToken();
      this.stateService.clearAllState();
      this.router.navigateByUrl(LOGIN_PAGE_PATH);
    });
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.http.get<UserResponseDTO[]>('/common/auth/users')
    .subscribe((data) => {
      this.userListSubject.next(data);
      this.userListDataLoadSubject.next(true);
    });
  }

  /** 사용자를 조회한다. */
  getUser(userId: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`/common/auth/users/${userId}`);
  }

  /** 사용자를 수정한다. */
  updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Observable<UserResponseDTO> {
    const { userId } = updateUserRequestDTO;
    return this.http.put<UserResponseDTO>(`/common/auth/users/${userId}`, updateUserRequestDTO);
  }

  /** 사용자를 삭제한다. */
  removeUser(userId: number): Observable<void> {
    return this.http.delete<void>(`/common/auth/users/${userId}`);
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.http.get<RoleResponseDTO[]>('/common/auth/roles')
    .subscribe((data) => {
      this.roleListSubject.next(data);
      this.roleListDataLoadSubject.next(true);
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

}
