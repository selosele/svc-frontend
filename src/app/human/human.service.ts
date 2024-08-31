import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tab } from '@app/shared/models';
import { CompanyResponseDTO, WorkHistoryResponseDTO, EmployeeResponseDTO, GetCompanyRequestDTO, GetVacationRequestDTO, SaveWorkHistoryRequestDTO, SaveEmployeeRequestDTO, VacationResponseDTO, SaveVacationRequestDTO } from './human.model';

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

  /** 근무이력 목록 */
  workHistoryList = new BehaviorSubject<WorkHistoryResponseDTO[]>(null);
  workHistoryList$ = this.workHistoryList.asObservable();
  workHistoryTabList = new BehaviorSubject<Tab[]>(null);
  workHistoryTabList$ = this.workHistoryTabList.asObservable();

  /** 근무이력 목록 데이터 로드 완료 여부 */
  workHistoryListDataLoad = new BehaviorSubject<boolean>(false);
  workHistoryListDataLoad$ = this.workHistoryListDataLoad.asObservable();

  /** 근무이력 ID */
  workHistoryId = new BehaviorSubject<number>(null);
  workHistoryId$ = this.workHistoryId.asObservable();

  /** 근무이력 ID 값을 설정한다. */
  setWorkHistoryId(value: number): void {
    this.workHistoryId.next(value);
  }

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`)
    .subscribe((data) => {
      this.employee.next(data);
      this.employeeDataLoad.next(true);
    });
  }

  /** 직원을 수정한다. */
  updateEmployee$(saveEmployeeRequestDTO: SaveEmployeeRequestDTO): Observable<EmployeeResponseDTO> {
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

  /** 근무이력 목록을 조회한다. */
  listWorkHistory(employeeId: number): void {
    this.http.get<WorkHistoryResponseDTO[]>(`/human/employees/${employeeId}/companies`)
    .subscribe((data) => {
      this.workHistoryList.next(data);
      this.workHistoryTabList.next(data.map(x => ({ title: x.companyName, key: x.workHistoryId })));
      this.workHistoryListDataLoad.next(true);
    });
  }

  /** 근무이력을 조회한다. */
  getWorkHistory$(employeeId: number, workHistoryId: number): Observable<WorkHistoryResponseDTO> {
    return this.http.get<WorkHistoryResponseDTO>(`/human/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 근무이력을 추가한다. */
  addWorkHistory$(saveWorkHistoryRequestDTO: SaveWorkHistoryRequestDTO): Observable<void> {
    const { employeeId } = saveWorkHistoryRequestDTO;
    return this.http.post<void>(`/human/employees/${employeeId}/companies`, saveWorkHistoryRequestDTO);
  }

  /** 근무이력을 수정한다. */
  updateWorkHistory$(saveWorkHistoryRequestDTO: SaveWorkHistoryRequestDTO): Observable<void> {
    const { employeeId, workHistoryId } = saveWorkHistoryRequestDTO;
    return this.http.put<void>(`/human/employees/${employeeId}/companies/${workHistoryId}`, saveWorkHistoryRequestDTO);
  }

  /** 근무이력을 삭제한다. */
  removeWorkHistory$(employeeId: number, workHistoryId: number): Observable<void> {
    return this.http.delete<void>(`/human/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 휴가 목록을 조회한다. */
  listVacation$(getVacationRequestDTO: GetVacationRequestDTO): Observable<VacationResponseDTO[]> {
    return this.http.get<VacationResponseDTO[]>('/human/vacations', { params: { ...getVacationRequestDTO } });
  }

  /** 휴가를 조회한다. */
  getVacation$(vacationId: number): Observable<VacationResponseDTO> {
    return this.http.get<VacationResponseDTO>(`/human/vacations/${vacationId}`);
  }

  /** 휴가를 추가한다. */
  addVacation$(saveVacationRequestDTO: SaveVacationRequestDTO): Observable<VacationResponseDTO> {
    return this.http.post<VacationResponseDTO>('/human/vacations', saveVacationRequestDTO);
  }

  /** 휴가를 수정한다. */
  updateVacation$(saveVacationRequestDTO: SaveVacationRequestDTO): Observable<number> {
    const { vacationId } = saveVacationRequestDTO;
    return this.http.put<number>(`/human/vacations/${vacationId}`, saveVacationRequestDTO);
  }

  /** 휴가를 삭제한다. */
  removeVacation$(vacationId: number): Observable<void> {
    return this.http.delete<void>(`/human/vacations/${vacationId}`);
  }

}
