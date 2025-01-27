import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateUtil, isNotBlank } from '@app/shared/utils';
import { HttpService, StoreService } from '@app/shared/services';
import { WorkHistoryResponseDTO } from '@app/human/human.model';
import { AddVacationCalcRequestDTO, GetVacationByMonthRequestDTO, GetVacationRequestDTO, GetVacationStatsRequestDTO, SaveVacationRequestDTO, VacationByMonthResponseDTO, VacationCalcResponseDTO, VacationDataStateDTO, VacationResponseDTO, VacationStatsResponseDTO } from '@app/vacation/vacation.model';

@Injectable({ providedIn: 'root' })
export class VacationService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private store: StoreService,
  ) {}

  /** 휴가 목록 */
  private vacationList = this.store.create<VacationDataStateDTO>('vacationList', []);

  /** 휴가 탭별 테이블 타이틀 */
  private vacationTableTitle = this.store.create<string>('vacationTableTitle', null);

  /** 휴가 탭별 테이블 텍스트 */
  private vacationTableText = this.store.create<string>('vacationTableText', null);

  /** 휴가 통계 정보 */
  private vacationStatResponse = this.store.create<VacationStatsResponseDTO>('vacationStatResponse', null);

  /** 휴가 통계 정보 데이터 로드 완료 여부 */
  private vacationStatResponseDataLoad = this.store.create<boolean>('vacationStatResponseDataLoad', false);

  /** 재직 중인 회사인지 여부 */
  private isNotQuit = this.store.create<boolean>('isNotQuit', true);

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

  /** 휴가 통계 목록을 조회한다. */
  listVacationStats$(dto: GetVacationStatsRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<VacationStatsResponseDTO[]>('/hm/vacations/stats', { params });
  }

  /** 월별 휴가사용일수 목록을 조회한다. */
  listVacationByMonth$(dto: GetVacationByMonthRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<VacationByMonthResponseDTO[]>('/hm/vacations/stats/month', { params });
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
    const { annualTypeCode, joinYmd, quitYmd, vacationTotalCountByJoinYmd } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        const joinYmdFormat = dateUtil(joinYmd).format('YYYY년 MM월 DD일');
        text += `입사 ${joinYmdFormat}부터 총 <strong>${vacationTotalCountByJoinYmd}</strong>개의 월차가 발생했어요.`;
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
    const { annualTypeCode, vacationTotalCountByJoinYmd, vacationTotalCountByFiscalYear, vacationRemainCountByJoinYmd, vacationRemainCountByFiscalYear } = workHistory;
    switch (annualTypeCode) {

      // 입사일자 기준
      case 'JOIN_YMD':
        return `잔여 월차: <strong class="text-primary">${vacationRemainCountByJoinYmd}</strong>/${vacationTotalCountByJoinYmd}개`;
      
      // 회계연도 기준
      case 'FISCAL_YEAR':
        return `잔여 연차: <strong class="text-primary">${vacationRemainCountByFiscalYear}</strong>/${vacationTotalCountByFiscalYear}개`;
      
      default:
        return null;
    }
  }

}
