import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeResponseDTO } from './human.model';

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
  getEmployee(employeeId: number): Observable<EmployeeResponseDTO> {
    return this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`);
  }

}
