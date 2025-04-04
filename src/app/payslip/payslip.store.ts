import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { PayslipDataStateDTO, PayslipResponseDTO } from './payslip.model';
import { WorkHistoryResultDTO } from '@app/work-history/work-history.model';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';

@Injectable({ providedIn: 'root' })
export class PayslipStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'payslipResponse', defaultValue: null as PayslipDataStateDTO },           // 급여명세서 정보
      { key: 'mainPayslipResponse', defaultValue: null as PayslipResponseDTO },        // 메인화면 > 급여명세서 정보
      { key: 'mainPayslipResponseDataLoad', defaultValue: false },                     // 메인화면 > 급여명세서 정보 데이터 로드 완료 여부
      { key: 'mainPayslipTabList', defaultValue: [] as Tab[] },                        // 급여 탭 목록
      { key: 'mainPayslipTabIndex', defaultValue: null as number },                    // 선택된 급여 탭의 index
      { key: 'mainPayslipTabKey', defaultValue: null as string },                      // 선택된 급여 탭의 key
      
      { key: 'payslipTableTitle', defaultValue: null as string },                      // 급여명세서 탭별 테이블 타이틀
      { key: 'payslipTableText', defaultValue: null as string },                       // 급여명세서 탭별 테이블 텍스트
      
      { key: 'payslipWorkHistoryList', defaultValue: [] as WorkHistoryResultDTO[] },   // 근무이력 목록
      { key: 'payslipWorkHistoryTabList', defaultValue: [] as Tab[] },                 // 근무이력 탭 목록
      { key: 'payslipWorkHistoryTabIndex', defaultValue: 0 as number },                // 선택된 회사 탭의 index
      { key: 'payslipWorkHistoryListDataLoad', defaultValue: false },                  // 근무이력 목록 데이터 로드 완료 여부
      { key: 'payslipWorkHistoryId', defaultValue: null as number },                   // 근무이력 ID
    ]);
  }

}