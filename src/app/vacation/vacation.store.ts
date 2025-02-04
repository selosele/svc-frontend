import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { WorkHistoryResponseDTO } from '@app/work-history/work-history.model';
import { VacationDataStateDTO, VacationStatsResponseDTO } from './vacation.model';

@Injectable({ providedIn: 'root' })
export class VacationStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'vacationList', defaultValue: [] as VacationDataStateDTO },                // 휴가 목록
      { key: 'vacationTableTitle', defaultValue: null as string },                      // 휴가 탭별 테이블 타이틀
      { key: 'vacationTableText', defaultValue: null as string },                       // 휴가 탭별 테이블 텍스트
      { key: 'vacationStatResponse', defaultValue: null as VacationStatsResponseDTO },  // 휴가 통계 정보
      { key: 'vacationStatResponseDataLoad', defaultValue: false },                     // 휴가 통계 정보 데이터 로드 완료 여부

      { key: 'vacationWorkHistoryList', defaultValue: [] as WorkHistoryResponseDTO[] }, // 근무이력 목록
      { key: 'vacationWorkHistoryTabList', defaultValue: [] as Tab[] },                 // 근무이력 탭 목록
      { key: 'vacationWorkHistoryTabIndex', defaultValue: 0 as number },                // 선택된 회사 탭의 index
      { key: 'vacationWorkHistoryListDataLoad', defaultValue: false },                  // 근무이력 목록 데이터 로드 완료 여부
      { key: 'vacationWorkHistoryId', defaultValue: null as number },                   // 근무이력 ID
    ]);
  }

}