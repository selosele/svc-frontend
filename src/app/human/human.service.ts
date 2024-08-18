import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyResponseDTO, EmployeeCompanyResponseDTO, EmployeeResponseDTO, GetCompanyRequestDTO, SaveEmployeeCompanyRequestDTO, SaveEmployeeRequestDTO } from './human.model';

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

  /** 회사 목록 */
  companyList = new BehaviorSubject<CompanyResponseDTO[]>(null);
  companyList$ = this.companyList.asObservable();

  /** 회사 목록 데이터 로드 완료 여부 */
  companyListDataLoad = new BehaviorSubject<boolean>(false);
  companyListDataLoad$ = this.companyListDataLoad.asObservable();

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`)
    .subscribe((data) => {
      this.employee.next(data);
      this.employeeDataLoad.next(true);
    });
  }

  /** 직원을 수정한다. */
  updateEmployee(saveEmployeeRequestDTO: SaveEmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    const { employeeId } = saveEmployeeRequestDTO;
    return this.http.put<EmployeeResponseDTO>(`/human/employees/${employeeId}`, saveEmployeeRequestDTO);
  }

  /** 회사 목록을 조회한다. */
  listCompany(getCompanyRequestDTO?: GetCompanyRequestDTO): void {
    this.http.get<CompanyResponseDTO[]>('/human/companies', { params: { ...getCompanyRequestDTO } })
    .subscribe((data) => {
      this.companyList.next(data);
      this.companyListDataLoad.next(true);
    });
  }

  /** 직원 회사를 조회한다. */
  getEmployeeCompany(employeeId: number, employeeCompanyId: number): Observable<EmployeeCompanyResponseDTO> {
    return this.http.get<EmployeeCompanyResponseDTO>(`/human/employees/${employeeId}/companies/${employeeCompanyId}`);
  }

  /** 직원 회사를 추가한다. */
  addEmployeeCompany(saveEmployeeCompanyRequestDTO: SaveEmployeeCompanyRequestDTO): Observable<void> {
    const { employeeId } = saveEmployeeCompanyRequestDTO;
    return this.http.post<void>(`/human/employees/${employeeId}/companies`, saveEmployeeCompanyRequestDTO);
  }

  /** 직원 회사를 수정한다. */
  updateEmployeeCompany(saveEmployeeCompanyRequestDTO: SaveEmployeeCompanyRequestDTO): Observable<void> {
    const { employeeId, employeeCompanyId } = saveEmployeeCompanyRequestDTO;
    return this.http.put<void>(`/human/employees/${employeeId}/companies/${employeeCompanyId}`, saveEmployeeCompanyRequestDTO);
  }

  /** 직원 회사를 삭제한다. */
  removeEmployeeCompany(employeeId: number, employeeCompanyId: number): Observable<void> {
    return this.http.delete<void>(`/human/employees/${employeeId}/companies/${employeeCompanyId}`);
  }

}
