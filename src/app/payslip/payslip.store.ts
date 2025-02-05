import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { PayslipDataStateDTO } from './payslip.model';
import { WorkHistoryResponseDTO } from '@app/work-history/work-history.model';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';

@Injectable({ providedIn: 'root' })
export class PayslipStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'payslipList', defaultValue: null as PayslipDataStateDTO },               // 급여명세서 목록
      { key: 'payslipTableTitle', defaultValue: null as string },                      // 급여명세서 탭별 테이블 타이틀
      { key: 'payslipTableText', defaultValue: null as string },                       // 급여명세서 탭별 테이블 텍스트
      
      { key: 'payslipWorkHistoryList', defaultValue: [] as WorkHistoryResponseDTO[] }, // 근무이력 목록
      { key: 'payslipWorkHistoryTabList', defaultValue: [] as Tab[] },                 // 근무이력 탭 목록
      { key: 'payslipWorkHistoryTabIndex', defaultValue: 0 as number },                // 선택된 회사 탭의 index
      { key: 'payslipWorkHistoryListDataLoad', defaultValue: false },                  // 근무이력 목록 데이터 로드 완료 여부
      { key: 'payslipWorkHistoryId', defaultValue: null as number },                   // 근무이력 ID
    ]);
  }

}