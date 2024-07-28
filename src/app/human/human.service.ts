import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { isEmpty } from '@app/shared/utils';
import { DepartmentResponseDTO, EmployeeResponseDTO } from './human.model';

@Injectable({ providedIn: 'root' })
export class HumanService {

  constructor(
    private http: HttpClient,
  ) {}

  employeeSubject = new BehaviorSubject<EmployeeResponseDTO>(null);
  employeeDataLoadSubject = new BehaviorSubject<boolean>(false);

  /** 직원 정보 */
  employee$ = this.employeeSubject.asObservable();

  /** 직원 정보 데이터 로드 완료 여부 */
  employeeDataLoad$ = this.employeeDataLoadSubject.asObservable();

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`)
    .subscribe(data => {
      this.employeeSubject.next(data);
      this.employeeDataLoadSubject.next(true);
    });
  }

  /** 부서 목록에서 모든 부서 명을 연결해서 반환한다. */
  findDepartmentName(departments: DepartmentResponseDTO[]): string {
    if (isEmpty(departments)) return '';
    return departments.map(x => x.departmentName).join(' > ');
  }

}
