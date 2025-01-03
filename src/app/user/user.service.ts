import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService, StoreService } from '@app/shared/services';
import { AuthService } from '@app/auth/auth.service';
import { GetUserRequestDTO, UpdateUserPasswordRequestDTO, SaveUserRequestDTO, UserResponseDTO, UserSetupResponseDTO, AddUserRequestDTO } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private store: StoreService,
    private http: HttpClient,
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  /** 사용자 목록 */
  private userList = this.store.create<UserResponseDTO[]>('userList', []);

  /** 사용자 목록 데이터 로드 완료 여부 */
  private userListDataLoad = this.store.create<boolean>('userListDataLoad', false);

  /** 사용자 설정 */
  private userSetup = this.store.create<UserSetupResponseDTO>('userSetup', null);

  /** 사용자 설정 데이터 로드 완료 여부 */
  private userSetupDataLoad = this.store.create<boolean>('userSetupDataLoad', false);

  /** 사용자 목록을 조회한다. */
  listUser(): void {
    this.http.get<UserResponseDTO[]>('/co/users')
    .subscribe((data) => {
      this.store.update('userList', data);
      this.store.update('userListDataLoad', true);
    });
  }

  /** 권한별 사용자 목록을 조회한다. */
  listUserByRole$(dto: GetUserRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<UserResponseDTO[]>('/co/users', { params });
  }

  /** 사용자를 조회한다. */
  getUser$(userId: number) {
    return this.http.get<UserResponseDTO>(`/co/users/${userId}`);
  }

  /** 사용자 설정을 조회한다. */
  getUserConfig(userId: number): void {
    this.http.get<UserSetupResponseDTO>(`/co/users/${userId}/setups`)
    .subscribe((data) => {
      this.store.update('userSetup', data);
      this.store.update('userSetupDataLoad', true);
    });
  }

  /** 사용자 설정을 추가한다. */
  addUserSetup$(dto: AddUserRequestDTO) {
    const { userId } = dto;
    return this.http.post<UserSetupResponseDTO>(`/co/users/${userId}/setups`, dto);
  }

  /** 사용자를 추가한다. */
  addUser$(dto: SaveUserRequestDTO) {
    return this.http.post<UserResponseDTO>('/co/users', dto);
  }

  /** 사용자를 수정한다. */
  updateUser$(dto: SaveUserRequestDTO) {
    const { userId } = dto;
    return this.http.put<UserResponseDTO>(`/co/users/${userId}`, dto);
  }

  /** 사용자를 삭제한다. */
  removeUser$(userId: number) {
    return this.http.delete<void>(`/co/users/${userId}`);
  }

  /** 사용자 비밀번호를 변경한다. */
  updatePassword$(dto: UpdateUserPasswordRequestDTO) {
    const { userId } = this.authService.getAuthenticatedUser();
    return this.http.put<void>(`/co/users/${userId}/password`, dto);
  }

}
