import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService, StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { CompanyResponseDTO, WorkHistoryResponseDTO, EmployeeResponseDTO, GetCompanyRequestDTO, SaveWorkHistoryRequestDTO, SaveEmployeeRequestDTO, GetWorkHistoryRequestDTO, CompanyOpenAPIResponseDTO, GetCompanyApplyRequestDTO, CompanyApplyResponseDTO, SaveCompanyApplyRequestDTO, SaveCompanyRequestDTO } from './human.model';

@Injectable({ providedIn: 'root' })
export class HumanService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private store: StoreService,
  ) {}

  /** 직원 정보 */
  private employee = this.store.create<EmployeeResponseDTO>('employee', null);

  /** 직원 정보 데이터 로드 완료 여부 */
  private employeeDataLoad = this.store.create<boolean>('employeeDataLoad', false);

  /** 회사 목록 */
  private companyList = this.store.create<CompanyResponseDTO[]>('companyList', []);

  /** 회사 목록 데이터 로드 완료 여부 */
  private companyListDataLoad = this.store.create<boolean>('companyListDataLoad', false);

  /** 회사등록신청 목록 */
  private companyApplyList = this.store.create<CompanyResponseDTO[]>('companyApplyList', []);

  /** 회사등록신청 목록 데이터 로드 완료 여부 */
  private companyApplyListDataLoad = this.store.create<boolean>('companyApplyListDataLoad', false);

  /** 근무이력 목록 */
  private workHistoryList = this.store.create<WorkHistoryResponseDTO[]>('workHistoryList', []);

  /** 근무이력 탭 목록 */
  private workHistoryTabList = this.store.create<Tab[]>('workHistoryTabList', []);

  /** 근무이력 탭 목록 */
  private workHistoryTabIndex = this.store.create<number>('workHistoryTabIndex', 0);

  /** 근무이력 목록 데이터 로드 완료 여부 */
  private workHistoryListDataLoad = this.store.create<boolean>('workHistoryListDataLoad', false);

  /** 근무이력 ID */
  private workHistoryId = this.store.create<number>('workHistoryId', null);

  /** 근무이력 ID 값을 설정한다. */
  setWorkHistoryId(value: number): void {
    this.store.update('workHistoryId', value);
  }

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/hm/employees/${employeeId}`)
    .subscribe((data) => {
      this.store.update('employee', data);
      this.store.update('employeeDataLoad', true);
    });
  }

  /** 직원을 수정한다. */
  updateEmployee$(dto: SaveEmployeeRequestDTO) {
    const { employeeId } = dto;
    return this.http.put<EmployeeResponseDTO>(`/hm/employees/${employeeId}`, dto);
  }

  /** 회사 목록을 조회한다. */
  listCompany(dto?: GetCompanyRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<CompanyResponseDTO[]>('/hm/companies', { params })
    .subscribe((data) => {
      this.store.update('companyList', data);
      this.store.update('companyListDataLoad', true);
    });
  }

  /** 회사를 조회한다. */
  getCompany$(companyId: number) {
    return this.http.get<CompanyResponseDTO>(`/hm/companies/${companyId}`);
  }

  /** 회사를 추가한다. */
  addCompany$(dto: SaveCompanyRequestDTO) {
    return this.http.post<CompanyResponseDTO>('/hm/companies', dto);
  }

  /** 회사를 수정한다. */
  updateCompany$(dto: SaveCompanyRequestDTO) {
    const { companyId } = dto;
    return this.http.put<void>(`/hm/companies/${companyId}`, dto);
  }

  /** 회사를 삭제한다. */
  removeCompany$(companyId: number) {
    return this.http.delete<void>(`/hm/companies/${companyId}`);
  }

  /** Open API로 회사 목록을 조회한다. */
  listCompanyOpenAPI$(dto?: GetCompanyRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<CompanyOpenAPIResponseDTO[]>('/public/hm/companies', { params });
  }

  /** 회사등록신청 목록을 조회한다. */
  listCompanyApply(dto?: GetCompanyApplyRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<CompanyApplyResponseDTO[]>('/hm/company-applies', { params })
    .subscribe((data) => {
      this.store.update('companyApplyList', data);
      this.store.update('companyApplyListDataLoad', true);
    });
  }

  /** 회사등록신청을 조회한다. */
  getCompanyApply$(companyApplyId: number) {
    return this.http.get<CompanyApplyResponseDTO>(`/hm/company-applies/${companyApplyId}`);
  }

  /** 회사등록신청을 추가한다. */
  addCompanyApply$(dto: SaveCompanyApplyRequestDTO) {
    return this.http.post<void>('/hm/company-applies', dto);
  }

  /** 회사등록신청을 수정한다. */
  updateCompanyApply$(dto: SaveCompanyApplyRequestDTO) {
    const { companyApplyId } = dto;
    return this.http.put<void>(`/hm/company-applies/${companyApplyId}`, dto);
  }

  /** 근무이력 목록을 조회한다. */
  listWorkHistory$(dto: GetWorkHistoryRequestDTO) {
    const { employeeId } = dto;
    const params = this.httpService.createParams(dto);

    return this.http.get<WorkHistoryResponseDTO[]>(`/hm/employees/${employeeId}/companies`, { params });
  }

  /** 근무이력을 조회한다. */
  getWorkHistory$(employeeId: number, workHistoryId: number) {
    return this.http.get<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies/${workHistoryId}`);
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
