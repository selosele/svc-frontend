import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateUtil, isNotBlank } from '@app/shared/utils';
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

  /** 휴가 탭별 테이블 텍스트 */
  private vacationTableText = this.store.create<string>('vacationTableText', null);

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

  /** 테이블 문구를 설정한다. */
  setVacationTableContent(index: number): void {
    const workHistory = this.store.select<WorkHistoryResponseDTO[]>('workHistoryList').value[index];
    const { quitYmd } = workHistory;

    if (isNotBlank(quitYmd)) {
      // this.store.update('isNotQuit', false);
      // this.store.update('vacationTableTitle', '퇴사한 회사는 휴가계산을 제공하지 않습니다.');
      // return;
    }

    // this.store.update('isNotQuit', true);
    this.store.update('vacationTableTitle', this.showVacationCount(workHistory));
    this.store.update('vacationTableText', this.setVacationTableText(workHistory));
  }

  /** 테이블 텍스트를 설정한다. */
  setVacationTableText(workHistory: WorkHistoryResponseDTO): string {
    const { annualTypeCode, joinYmd, workDiffM } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        const joinYmdFormat = dateUtil(joinYmd).format('YYYY년 MM월 DD일');
        return `입사 ${joinYmdFormat}부터 총 <strong>${workDiffM}</strong>개의 월차가 발생하였음`;
      
      // 회계년도 기준
      case 'FISCAL_YEAR':
        return `
          근로기준법 제60조 4항에 의거, 3년 이상 근속했을 경우 2년마다 1일씩 가산된 유급휴가가 부여된다.<br>
          이 때, 가산일수와 기본일수를 합한 총 유급휴가 일수의 한도는 25일이다.
        `;
      
      default:
        return null;
    }
  }

  /** 잔여 휴가를 표출한다. */
  showVacationCount(workHistory: WorkHistoryResponseDTO): string {
    const { annualTypeCode, joinYmd, workDiffM, vacationRemainCount } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        return `잔여 월차: <strong class="text-primary">${vacationRemainCount}</strong>/${workDiffM}개`;
      
      // 회계년도 기준
      case 'FISCAL_YEAR':
        return `잔여 연차: <strong class="text-primary">${vacationRemainCount}</strong>/${this.getTotalAnnualCount(joinYmd)}개`;
      
      default:
        return null;
    }
  }

  /** total 연차개수를 반환한다. */
  private getTotalAnnualCount(joinYmd: string): number {
    const nextFiscalYmd = dateUtil(dateUtil().add(1, 'year').startOf('year')).format('YYYYMMDD'); // 내년 회계년도 날짜
    const joinYmdDiff = dateUtil().diff(joinYmd, 'year'); // 근속년수 계산

    // 입사일자가 1년 미만이면 내년 회계년도에 비례한 남은 개월수를 반환한다.
    if (dateUtil(nextFiscalYmd).diff(joinYmd, 'year') < 1) {
      return dateUtil(nextFiscalYmd).diff(joinYmd, 'month');
    }

    // 위 조건을 충족하지 않으면 15개의 연차를 반환한다.
    // 단, 3년 이상 근속했을 경우 근속 2년마다 1일씩 가산(최대 25일까지)된 연차가 반환된다.
    const extraDays = Math.floor((joinYmdDiff - 3) / 2) + 1; // 3년 이상일 경우부터 가산
    return Math.min(15 + Math.max(0, extraDays), 25);        // 최대 25일까지 제한
  }

}
