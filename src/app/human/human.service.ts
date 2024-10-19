import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private employee = this.store.create<EmployeeResponseDTO>('employee', null);

  /** 직원 정보 데이터 로드 완료 여부 */
  private employeeDataLoad = this.store.create<boolean>('employeeDataLoad', false);

  /** 회사 목록 */
  private companyList = this.store.create<CompanyResponseDTO[]>('companyList', []);

  /** 회사 목록 데이터 로드 완료 여부 */
  private companyListDataLoad = this.store.create<boolean>('companyListDataLoad', false);

  /** 근무이력 목록 */
  private workHistoryList = this.store.create<WorkHistoryResponseDTO[]>('workHistoryList', []);

  /** 근무이력 탭 목록 */
  private workHistoryTabList = this.store.create<Tab[]>('workHistoryTabList', []);

  /** 근무이력 목록 데이터 로드 완료 여부 */
  private workHistoryListDataLoad = this.store.create<boolean>('workHistoryListDataLoad', false);

  /** 근무이력 ID */
  private workHistoryId = this.store.create<number>('workHistoryId', null);

  /** 휴가 목록 */
  private vacationList = this.store.create<VacationTabViewItem[]>('vacationList', []);

  /** 휴가 탭별 테이블 타이틀 */
  private vacationTableTitle = this.store.create<string>('vacationTableTitle', null);

  /** 재직 중인 회사인지 여부 */
  private isNotQuit = this.store.create<boolean>('isNotQuit', true);

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

  /** 근무이력 목록을 조회한다. */
  listWorkHistory(index: number, dto: GetWorkHistoryRequestDTO): void {
    const { employeeId } = dto;
    const params = this.httpService.createParams(dto);

    this.http.get<WorkHistoryResponseDTO[]>(`/hm/employees/${employeeId}/companies`, { params })
    .subscribe((data) => {
      this.store.update('workHistoryList', data);
      this.store.update('workHistoryTabList', data.map(x => ({ title: x.companyName, key: x.workHistoryId })));
      this.store.update('workHistoryListDataLoad', true);
      this.setVacationTableTitle(index);
    });
  }

  /** 근무이력을 조회한다. */
  getWorkHistory$(employeeId: number, workHistoryId: number) {
    return this.http.get<WorkHistoryResponseDTO>(`/hm/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 근무이력을 추가한다. */
  addWorkHistory$(dto: SaveWorkHistoryRequestDTO) {
    const { employeeId } = dto;
    return this.http.post<number>(`/hm/employees/${employeeId}/companies`, dto);
  }

  /** 근무이력을 수정한다. */
  updateWorkHistory$(dto: SaveWorkHistoryRequestDTO) {
    const { employeeId, workHistoryId } = dto;
    return this.http.put<number>(`/hm/employees/${employeeId}/companies/${workHistoryId}`, dto);
  }

  /** 근무이력을 삭제한다. */
  removeWorkHistory$(employeeId: number, workHistoryId: number) {
    return this.http.delete<void>(`/hm/employees/${employeeId}/companies/${workHistoryId}`);
  }

  /** 휴가 목록을 조회한다. */
  listVacation$(dto: GetVacationRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<VacationResponseDTO[]>('/hm/vacations', { params });
  }

  /** 휴가를 조회한다. */
  getVacation$(vacationId: number) {
    return this.http.get<VacationResponseDTO>(`/hm/vacations/${vacationId}`);
  }

  /** 휴가를 추가한다. */
  addVacation$(dto: SaveVacationRequestDTO) {
    return this.http.post<VacationResponseDTO>('/hm/vacations', dto);
  }

  /** 휴가를 수정한다. */
  updateVacation$(dto: SaveVacationRequestDTO) {
    const { vacationId } = dto;
    return this.http.put<number>(`/hm/vacations/${vacationId}`, dto);
  }

  /** 휴가를 삭제한다. */
  removeVacation$(vacationId: number) {
    return this.http.delete<void>(`/hm/vacations/${vacationId}`);
  }

  /** 테이블 타이틀을 설정한다. */
  setVacationTableTitle(index: number): void {
    const workHistory = this.store.select<WorkHistoryResponseDTO[]>('workHistoryList').value[index];
    const { annualTypeCode, quitYmd } = workHistory;

    if (isNotBlank(quitYmd)) {
      this.store.update('isNotQuit', false);
      this.store.update('vacationTableTitle', '퇴사한 회사는 휴가계산을 제공하지 않습니다.');
      return;
    }

    if (isEmpty(annualTypeCode) || annualTypeCode === '99') {
      this.store.update('vacationTableTitle', '근무이력에 연차발생기준이 입력되어 있지 않아 휴가계산을 사용할 수 없습니다.');
      return;
    }

    this.store.update('isNotQuit', true);
    this.store.update('vacationTableTitle', this.showVacationCount(workHistory));
  }

  /** 잔여 휴가를 표출한다. */
  showVacationCount(workHistory: WorkHistoryResponseDTO): string {
    const { annualTypeCode, joinYmd, vacationRemainCount } = workHistory;
    switch (annualTypeCode) {
      // 입사일자 기준
      // TODO: 입사일자 기준이지만 입사 1년이 지나면?
      case '01':
        const nowDate = dateUtil(dateUtil().format('YYYYMMDD'));
        const nowDateDiff = nowDate.diff(dateUtil(joinYmd), 'month');
        const joinYmdFormat = dateUtil(joinYmd).format('YYYY년 MM월 DD일');

        return `나의 잔여 월차: ${vacationRemainCount}/${nowDateDiff}개 (입사 ${joinYmdFormat}부터 총 ${nowDateDiff}개 월차가 발생하였음)`;
      // 회계년도 기준
      case '02':
        return ``;
      default: return null;
    }
  }

}
