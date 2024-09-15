import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dateUtil, isEmpty, isNotBlank } from '@app/shared/utils';
import { HttpService, StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { CompanyResponseDTO, WorkHistoryResponseDTO, EmployeeResponseDTO, GetCompanyRequestDTO, GetVacationRequestDTO, SaveWorkHistoryRequestDTO, SaveEmployeeRequestDTO, VacationResponseDTO, SaveVacationRequestDTO, VacationTabViewItem, GetWorkHistoryRequestDTO } from './human.model';

@Injectable({ providedIn: 'root' })
export class HumanService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private store: StoreService,
  ) {}

  /** 직원 정보 */
  employee = this.store.create<EmployeeResponseDTO>('employee', null);
  employee$ = this.employee?.asObservable();

  /** 직원 정보 데이터 로드 완료 여부 */
  employeeDataLoad = this.store.create<boolean>('employeeDataLoad', false);
  employeeDataLoad$ = this.employeeDataLoad?.asObservable();

  /** 회사 목록 */
  companyList = this.store.create<CompanyResponseDTO[]>('companyList', []);
  companyList$ = this.companyList?.asObservable();

  /** 회사 목록 데이터 로드 완료 여부 */
  companyListDataLoad = this.store.create<boolean>('companyListDataLoad', false);
  companyListDataLoad$ = this.companyListDataLoad?.asObservable();

  /** 근무이력 목록 */
  workHistoryList = this.store.create<WorkHistoryResponseDTO[]>('workHistoryList', []);
  workHistoryList$ = this.workHistoryList?.asObservable();
  workHistoryTabList = this.store.create<Tab[]>('workHistoryTabList', []);
  workHistoryTabList$ = this.workHistoryTabList?.asObservable();

  /** 근무이력 목록 데이터 로드 완료 여부 */
  workHistoryListDataLoad = this.store.create<boolean>('workHistoryListDataLoad', false);
  workHistoryListDataLoad$ = this.workHistoryListDataLoad?.asObservable();

  /** 근무이력 ID */
  workHistoryId = this.store.create<number>('workHistoryId', null);
  workHistoryId$ = this.workHistoryId?.asObservable();

  /** 휴가 목록 */
  vacationList = this.store.create<VacationTabViewItem[]>('vacationList', []);
  vacationList$ = this.vacationList?.asObservable();

  /** 휴가 탭별 테이블 타이틀 */
  vacationTableTitle = this.store.create<string>('vacationTableTitle', null);
  vacationTableTitle$ = this.vacationList?.asObservable();

  /** 재직 중인 회사인지 여부 */
  isNotQuit = this.store.create<boolean>('isNotQuit', true);
  isNotQuit$ = this.isNotQuit?.asObservable();

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
  updateEmployee$(dto: SaveEmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    const { employeeId } = dto;
    return this.http.put<EmployeeResponseDTO>(`/human/employees/${employeeId}`, dto);
  }

  /** 회사 목록을 조회한다. */
  listCompany(dto?: GetCompanyRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<CompanyResponseDTO[]>('/human/companies', { params })
    .subscribe((data) => {
      this.companyList.next(data);
      this.companyListDataLoad.next(true);
    });
  }

  /** 근무이력 목록을 조회한다. */
  listWorkHistory(dto: GetWorkHistoryRequestDTO): void {
    const { employeeId } = dto;
    const params = this.httpService.createParams(dto);

    this.http.get<WorkHistoryResponseDTO[]>(`/human/employees/${employeeId}/companies`, { params })
    .subscribe((data) => {
      this.workHistoryList.next(data);
      this.workHistoryTabList.next(data.map(x => ({ title: x.companyName, key: x.workHistoryId })));
      this.workHistoryListDataLoad.next(true);
      this.setVacationTableTitle(0);
    });
  }

  /** 근무이력을 조회한다. */
  getWorkHistory$(employeeId: number, workHistoryId: number): Observable<WorkHistoryResponseDTO> {
    return this.http.get<WorkHistoryResponseDTO>(`/human/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 근무이력을 추가한다. */
  addWorkHistory$(dto: SaveWorkHistoryRequestDTO): Observable<void> {
    const { employeeId } = dto;
    return this.http.post<void>(`/human/employees/${employeeId}/companies`, dto);
  }

  /** 근무이력을 수정한다. */
  updateWorkHistory$(dto: SaveWorkHistoryRequestDTO): Observable<void> {
    const { employeeId, workHistoryId } = dto;
    return this.http.put<void>(`/human/employees/${employeeId}/companies/${workHistoryId}`, dto);
  }

  /** 근무이력을 삭제한다. */
  removeWorkHistory$(employeeId: number, workHistoryId: number): Observable<void> {
    return this.http.delete<void>(`/human/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 휴가 목록을 조회한다. */
  listVacation$(dto: GetVacationRequestDTO): Observable<VacationResponseDTO[]> {
    const params = this.httpService.createParams(dto);
    return this.http.get<VacationResponseDTO[]>('/human/vacations', { params });
  }

  /** 휴가를 조회한다. */
  getVacation$(vacationId: number): Observable<VacationResponseDTO> {
    return this.http.get<VacationResponseDTO>(`/human/vacations/${vacationId}`);
  }

  /** 휴가를 추가한다. */
  addVacation$(dto: SaveVacationRequestDTO): Observable<VacationResponseDTO> {
    return this.http.post<VacationResponseDTO>('/human/vacations', dto);
  }

  /** 휴가를 수정한다. */
  updateVacation$(dto: SaveVacationRequestDTO): Observable<number> {
    const { vacationId } = dto;
    return this.http.put<number>(`/human/vacations/${vacationId}`, dto);
  }

  /** 휴가를 삭제한다. */
  removeVacation$(vacationId: number): Observable<void> {
    return this.http.delete<void>(`/human/vacations/${vacationId}`);
  }

  /** 테이블 타이틀을 설정한다. */
  setVacationTableTitle(index: number): void {
    const { annualTypeCode, quitYmd } = this.workHistoryList.value[index];
    if (isNotBlank(quitYmd)) {
      this.isNotQuit.next(false);
      this.vacationTableTitle.next('퇴사한 회사는 휴가계산을 제공하지 않습니다.');
      return;
    }

    if (isEmpty(annualTypeCode) || annualTypeCode === '99') {
      this.vacationTableTitle.next('근무이력에 연차발생기준이 입력되어 있지 않아 휴가계산을 사용할 수 없습니다.');
      return;
    }

    this.isNotQuit.next(true);
    this.vacationTableTitle.next(this.calculateVacation(this.workHistoryList.value[index]));
  }

  /** 잔여 휴가를 계산해서 반환한다. */
  calculateVacation(workHistory: WorkHistoryResponseDTO) {
    const { annualTypeCode, joinYmd, vacationUseCount } = workHistory;
    switch (annualTypeCode) {
      // 입사일자 기준
      // TODO: 입사일자 기준이지만 입사 1년이 지나면?
      case '01':
        const nowDate = dateUtil(dateUtil().format('YYYYMMDD'));
        const nowDateDiff = nowDate.diff(dateUtil(joinYmd), 'month');
        const vacationRemainCount = (vacationUseCount > nowDateDiff) ? 0 : (nowDateDiff - vacationUseCount);
        const joinYmdFormat = dateUtil(joinYmd).format('YYYY년 MM월 DD일');

        return `나의 잔여 월차: ${vacationRemainCount}/${nowDateDiff}개 (입사 ${joinYmdFormat}부터 총 ${nowDateDiff}개 월차가 발생하였음)`;
      // 회계년도 기준
      case '02':
        return ``;
      default: return null;
    }
  }

}
