import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dateUtil, isNotBlank } from '@app/shared/utils';
import { HttpService } from '@app/shared/services';
import { VacationStore } from './vacation.store';
import { AddVacationCalcRequestDTO, GetVacationByMonthRequestDTO, GetVacationRequestDTO, GetVacationStatsRequestDTO, SaveVacationRequestDTO, VacationByMonthResponseDTO, VacationCalcResponseDTO, VacationDataStateDTO, VacationResponseDTO, VacationStatsResponseDTO } from '@app/vacation/vacation.model';
import { WorkHistoryResultDTO } from '@app/work-history/work-history.model';

@Injectable({ providedIn: 'root' })
export class VacationService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private vacationStore: VacationStore,
  ) {}

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
    const workHistory = this.vacationStore.select<WorkHistoryResultDTO[]>('vacationWorkHistoryList').value[index];

    this.vacationStore.update('vacationTableTitle', this.showVacationCount(workHistory));
    this.vacationStore.update('vacationTableText', this.setVacationTableText(workHistory));
  }

  /** 테이블 텍스트를 설정한다. */
  setVacationTableText(workHistory: WorkHistoryResultDTO): string {
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
  showVacationCount(workHistory: WorkHistoryResultDTO): string {
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

  /** 근무이력 ID 값을 설정한다. */
  setWorkHistoryId(value: number): void {
    this.vacationStore.update('vacationWorkHistoryId', value);
  }

}
