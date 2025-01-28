import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { UserCertHistoryResponseDTO } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'userCertHistory', defaultValue: null as UserCertHistoryResponseDTO }, // 사용자 본인인증 이력
    ]);
  }

}