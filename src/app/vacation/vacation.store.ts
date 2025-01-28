import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { VacationDataStateDTO, VacationStatsResponseDTO } from './vacation.model';

@Injectable({ providedIn: 'root' })
export class VacationStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'vacationList', defaultValue: [] as VacationDataStateDTO },               // 휴가 목록
      { key: 'vacationTableTitle', defaultValue: null as string },                     // 휴가 탭별 테이블 타이틀
      { key: 'vacationTableText', defaultValue: null as string },                      // 휴가 탭별 테이블 텍스트
      { key: 'vacationStatResponse', defaultValue: null as VacationStatsResponseDTO }, // 휴가 통계 정보
      { key: 'vacationStatResponseDataLoad', defaultValue: false },                    // 휴가 통계 정보 데이터 로드 완료 여부
      { key: 'isNotQuit', defaultValue: true },                                        // 재직 중인 회사인지 여부
    ]);
  }

}