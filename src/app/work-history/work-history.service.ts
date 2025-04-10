import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/shared/services';
import { WorkHistoryResponseDTO, SaveWorkHistoryRequestDTO, GetWorkHistoryRequestDTO } from './work-history.model';

@Injectable({ providedIn: 'root' })
export class WorkHistoryService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) {}

  /** 근무이력 목록을 조회한다. */
  listWorkHistory$(dto: GetWorkHistoryRequestDTO) {
    const { employeeId } = dto;
    const params = this.httpService.createParams(dto);

    return this.http.get<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies`, { params });
  }

  /** 근무이력을 조회한다. */
  getWorkHistory$(employeeId: number, workHistoryId: number) {
    return this.http.get<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 최신 근무이력을 조회한다. */
  getCurrentWorkHistory$(employeeId: number) {
    return this.http.get<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies/current`);
  }

  /** 근무이력을 추가한다. */
  addWorkHistory$(dto: SaveWorkHistoryRequestDTO) {
    const { employeeId } = dto;
    return this.http.post<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies`, dto);
  }

  /** 근무이력을 수정한다. */
  updateWorkHistory$(dto: SaveWorkHistoryRequestDTO) {
    const { employeeId, workHistoryId } = dto;
    return this.http.put<void>(`/hm/employees/${employeeId}/companies/${workHistoryId}`, dto);
  }

  /** 근무이력을 삭제한다. */
  removeWorkHistory$(employeeId: number, workHistoryId: number) {
    return this.http.delete<void>(`/hm/employees/${employeeId}/companies/${workHistoryId}`);
  }

}
