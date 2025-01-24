import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateUtil, isNotBlank } from '@app/shared/utils';
import { HttpService, StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { CompanyResponseDTO, WorkHistoryResponseDTO, EmployeeResponseDTO, GetCompanyRequestDTO, GetVacationRequestDTO, SaveWorkHistoryRequestDTO, SaveEmployeeRequestDTO, VacationResponseDTO, SaveVacationRequestDTO, GetWorkHistoryRequestDTO, VacationCalcResponseDTO, AddVacationCalcRequestDTO, CompanyOpenAPIResponseDTO, GetCompanyApplyRequestDTO, CompanyApplyResponseDTO, SaveCompanyApplyRequestDTO, SaveCompanyRequestDTO, VacationDataStateDTO } from './human.model';

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

  /** 휴가 목록 */
  private vacationList = this.store.create<VacationDataStateDTO>('vacationList', []);

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
    return this.http.put<void>(`/hm/vacations/${vacationId}`, dto);
  }

  /** 휴가를 삭제한다. */
  removeVacation$(vacationId: number) {
    return this.http.delete<void>(`/hm/vacations/${vacationId}`);
  }

  /** 휴가 계산 설정 목록을 조회한다. */
  listVacationCalc$(workHistoryId: number) {
    return this.http.get<VacationCalcResponseDTO[]>(`/hm/vacations/calcs/${workHistoryId}`);
  }

  /** 휴가 계산 설정을 추가한다. */
  addVacationCalc$(dto: AddVacationCalcRequestDTO) {
    const { workHistoryId } = dto;
    return this.http.post<void>(`/hm/vacations/calcs/${workHistoryId}`, dto);
  }

  /** 테이블 문구를 설정한다. */
  setVacationTableContent(index: number): void {
    const workHistory = this.store.select<WorkHistoryResponseDTO[]>('workHistoryList').value[index];
    const { quitYmd } = workHistory;

    if (isNotBlank(quitYmd)) {
      // this.store.update('isNotQuit', false);
      // this.store.update('vacationTableTitle', '퇴사한 회사는 휴가계산을 제공하지 않아요.');
      // return;
    }

    // this.store.update('isNotQuit', true);
    this.store.update('vacationTableTitle', this.showVacationCount(workHistory));
    this.store.update('vacationTableText', this.setVacationTableText(workHistory));
  }

  /** 테이블 텍스트를 설정한다. */
  setVacationTableText(workHistory: WorkHistoryResponseDTO): string {
    let text = '';
    const { annualTypeCode, joinYmd, quitYmd, workDiffM } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        const joinYmdFormat = dateUtil(joinYmd).format('YYYY년 MM월 DD일');
        text += `입사 ${joinYmdFormat}부터 총 <strong>${workDiffM-1}</strong>개의 월차가 발생했어요.`;
        if (isNotBlank(quitYmd)) {
          text += `<br>퇴사했을 경우 퇴사일자(${quitYmd})를 기준으로 마지막 월차 개수가 계산돼요.`;
        }
        return text;
      
      // 회계연도 기준
      case 'FISCAL_YEAR':
        text += `
          근로기준법 제60조 4항에 의거, 3년 이상 근속했을 경우 2년마다 1일씩 가산된 유급휴가가 부여돼요.<br>
          이 경우 가산휴가를 포함한 총 휴가 일수는 25일을 한도로 하고 있어요.
        `;
        return text;
      
      default:
        return text;
    }
  }

  /** 잔여 휴가를 표출한다. */
  showVacationCount(workHistory: WorkHistoryResponseDTO): string {
    const { annualTypeCode, joinYmd, quitYmd, workDiffM, vacationRemainCountByJoinYmd, vacationRemainCountByFiscalYear } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        return `잔여 월차: <strong class="text-primary">${vacationRemainCountByJoinYmd}</strong>/${workDiffM-1}개`;
      
      // 회계연도 기준
      case 'FISCAL_YEAR':
        return `잔여 연차: <strong class="text-primary">${vacationRemainCountByFiscalYear}</strong>/${this.getTotalAnnualCount(joinYmd, quitYmd)}개`;
      
      default:
        return null;
    }
  }

  /** total 연차개수를 반환한다. */
  private getTotalAnnualCount(joinYmd: string, quitYmd: string): number {
    const nextFiscalYmd = dateUtil(dateUtil().add(1, 'year').startOf('year')).format('YYYYMMDD'); // 내년 회계연도 날짜
    let joinYmdDiff = dateUtil().diff(joinYmd, 'year'); // 근속연수 계산

    // 퇴사한 회사는 퇴사일자를 기준으로 근속연수를 계산
    if (isNotBlank(quitYmd)) {
      joinYmdDiff = dateUtil(quitYmd).diff(joinYmd, 'year');
    }

    // 입사일자가 1년 미만이면 내년 회계연도에 비례한 남은 개월수를 반환한다.
    if (dateUtil(nextFiscalYmd).diff(joinYmd, 'year') < 1) {
      return dateUtil(nextFiscalYmd).diff(joinYmd, 'month');
    }

    // 위 조건을 충족하지 않으면 15개의 연차를 반환한다.
    // 단, 3년 이상 근속했을 경우 근속 2년마다 1일씩 가산(최대 25일까지)된 연차가 반환된다.
    const extraDays = Math.floor((joinYmdDiff - 3) / 2) + 1; // 3년 이상일 경우부터 가산
    return Math.min(15 + Math.max(0, extraDays), 25);        // 최대 25일까지 제한
  }

}
