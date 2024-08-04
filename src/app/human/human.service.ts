import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isEmpty } from '@app/shared/utils';
import { DepartmentResponseDTO, EmployeeResponseDTO, UpdateEmployeeRequestDTO } from './human.model';

@Injectable({ providedIn: 'root' })
export class HumanService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 직원 정보 */
  employee = new BehaviorSubject<EmployeeResponseDTO>(null);
  employee$ = this.employee.asObservable();

  /** 직원 정보 데이터 로드 완료 여부 */
  employeeDataLoad = new BehaviorSubject<boolean>(false);
  employeeDataLoad$ = this.employeeDataLoad.asObservable();

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`)
    .subscribe(data => {
      this.employee.next(data);
      this.employeeDataLoad.next(true);
    });
  }

  /** 직원을 수정한다. */
  updateEmployee(updateEmployeeRequestDTO: UpdateEmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    const { employeeId } = updateEmployeeRequestDTO;
    return this.http.put<EmployeeResponseDTO>(`/human/employees/${employeeId}`, updateEmployeeRequestDTO);
  }

  /** 부서 목록에서 모든 부서명을 연결해서 반환한다. */
  findDepartmentName(departments: DepartmentResponseDTO[]): string {
    if (isEmpty(departments)) return '';
    return departments.map(x => x.departmentName).join(' > ');
  }

}
