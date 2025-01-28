import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { UserResponseDTO, UserSetupResponseDTO } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'userList', defaultValue: [] as UserResponseDTO[] },       // 사용자 목록
      { key: 'userListDataLoad', defaultValue: false },                 // 사용자 목록 데이터 로드 완료 여부
      { key: 'userSetup', defaultValue: null as UserSetupResponseDTO }, // 사용자 설정
      { key: 'userSetupDataLoad', defaultValue: false },                // 사용자 설정 데이터 로드 완료 여부
    ]);
  }

}