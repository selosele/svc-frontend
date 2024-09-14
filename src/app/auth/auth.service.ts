import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { HttpService, StoreService, UiDialogService } from '@app/shared/services';
import { ACCESS_TOKEN_KEY, LOGIN_PAGE_PATH, SAVE_USER_ACCOUNT_KEY, isNotBlank } from '@app/shared/utils';
import { AuthenticatedUser, GetUserRequestDTO, LoginRequestDTO, LoginResponseDTO, RoleResponseDTO, UpdateUserPasswordRequestDTO, SaveUserRequestDTO, UserResponseDTO } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private router: Router,
    private store: StoreService,
    private http: HttpClient,
    private httpService: HttpService,
    private jwtHelper: JwtHelperService,
    private dialogService: UiDialogService,
  ) {}

  /** 사용자 목록 */
  userList = this.store.createState<UserResponseDTO[]>('userList', []);
  userList$ = this.userList?.asObservable();

  /** 사용자 목록 데이터 로드 완료 여부 */
  userListDataLoad = this.store.createState<boolean>('userListDataLoad', false);
  userListDataLoad$ = this.userListDataLoad?.asObservable();

  /** 권한 목록 */
  roleList = this.store.createState<RoleResponseDTO[]>('roleList', []);
  roleList$ = this.roleList?.asObservable();

  /** 권한 목록 데이터 로드 완료 여부 */
  roleListDataLoad = this.store.createState<boolean>('roleListDataLoad', false);
  roleListDataLoad$ = this.roleListDataLoad?.asObservable();

  /** 로그인을 한다. */
  login(dto: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/common/auth/login', dto)
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

  /** 로그아웃을 한다. */
  logout(): void {
    this.http.post<void>('/common/auth/logout', {})
    .subscribe(() => {
      this.removeAccessToken();
      this.dialogService.closeAllDialog();

      Object.keys(window.localStorage).forEach(key => {
        if (key !== SAVE_USER_ACCOUNT_KEY) { // 필수로 저장되어 있어야 하는 key를 제외하고 전부 삭제
          window.localStorage.removeItem(key);
        }
      });

      this.store.resetAll(); // 모든 상태를 초기화
      this.router.navigateByUrl(LOGIN_PAGE_PATH);
    });
  }

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.http.get<UserResponseDTO[]>('/common/auth/users')
    .subscribe((data) => {
      this.userList.next(data);
      this.userListDataLoad.next(true);
    });
  }

  /** 권한별 사용자 목록을 조회한다. */
  listUserByRole$(dto: GetUserRequestDTO): Observable<UserResponseDTO[]> {
    const params = this.httpService.createParams(dto);
    return this.http.get<UserResponseDTO[]>('/common/auth/users', { params });
  }

  /** 사용자를 조회한다. */
  getUser$(userId: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`/common/auth/users/${userId}`);
  }

  /** 사용자를 추가한다. */
  addUser$(dto: SaveUserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>('/common/auth/users', dto);
  }

  /** 사용자를 수정한다. */
  updateUser$(dto: SaveUserRequestDTO): Observable<UserResponseDTO> {
    const { userId } = dto;
    return this.http.put<UserResponseDTO>(`/common/auth/users/${userId}`, dto);
  }

  /** 사용자를 삭제한다. */
  removeUser$(userId: number): Observable<void> {
    return this.http.delete<void>(`/common/auth/users/${userId}`);
  }

  /** 사용자 비밀번호를 변경한다. */
  updatePassword$(dto: UpdateUserPasswordRequestDTO): Observable<number> {
    const { userId } = this.getAuthenticatedUser();
    return this.http.put<number>(`/common/auth/users/${userId}/password`, dto);
  }

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.http.get<RoleResponseDTO[]>('/common/auth/roles')
    .subscribe((data) => {
      this.roleList.next(data);
      this.roleListDataLoad.next(true);
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

  /** 로컬스토리지에 저장된 아이디 저장 여부 */
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
