import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleStore } from './role.store';
import { RoleResponseDTO } from './role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(
    private roleStore: RoleStore,
    private http: HttpClient,
  ) {}

  /** 권한 목록을 조회한다. */
  listRole(): void {
    this.http.get<RoleResponseDTO>('/co/roles')
    .subscribe((response) => {
      this.roleStore.update('roleList', response.roleList);
      this.roleStore.update('roleListDataLoad', true);
    });
  }

}
