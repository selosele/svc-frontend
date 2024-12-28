import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '@app/shared/services';
import { RoleResponseDTO } from './role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(
    private store: StoreService,
    private http: HttpClient,
  ) {}

  /** 권한 목록 */
  private roleList = this.store.create<RoleResponseDTO[]>('roleList', []);

  /** 권한 목록 데이터 로드 완료 여부 */
  private roleListDataLoad = this.store.create<boolean>('roleListDataLoad', false);

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.http.get<RoleResponseDTO[]>('/co/roles')
    .subscribe((data) => {
      this.store.update('roleList', data);
      this.store.update('roleListDataLoad', true);
    });
  }

}
