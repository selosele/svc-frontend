import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeStore } from './employee.store';
import { EmployeeResponseDTO, SaveEmployeeRequestDTO } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private employeeStore: EmployeeStore,
  ) {}

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/hm/employees/${employeeId}`)
    .subscribe((response) => {
      this.employeeStore.update('employee', response.employee);
      this.employeeStore.update('employeeDataLoad', true);
    });
  }

  /** 직원을 조회한다. */
  getEmployee$(employeeId: number) {
    return this.http.get<EmployeeResponseDTO>(`/hm/employees/${employeeId}`);
  }

  /** 직원을 수정한다. */
  updateEmployee$(dto: SaveEmployeeRequestDTO) {
    const { employeeId } = dto;
    return this.http.put<EmployeeResponseDTO>(`/hm/employees/${employeeId}`, dto);
  }

}
