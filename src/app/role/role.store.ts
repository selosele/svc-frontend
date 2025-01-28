import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { RoleResponseDTO } from './role.model';

@Injectable({ providedIn: 'root' })
export class RoleStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'roleList', defaultValue: [] as RoleResponseDTO[] }, // 권한 목록
      { key: 'roleListDataLoad', defaultValue: false },           // 권한 목록 데이터 로드 완료 여부
    ]);
  }

}