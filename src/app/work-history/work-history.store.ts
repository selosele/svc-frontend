import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { WorkHistoryResponseDTO } from './work-history.model';

@Injectable({ providedIn: 'root' })
export class WorkHistoryStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'workHistoryList', defaultValue: [] as WorkHistoryResponseDTO[] }, // 근무이력 목록
      { key: 'workHistoryTabList', defaultValue: [] as Tab[] },                 // 근무이력 탭 목록
      { key: 'workHistoryTabIndex', defaultValue: 0 as number },                // 선택된 회사 탭의 index
      { key: 'workHistoryListDataLoad', defaultValue: false },                  // 근무이력 목록 데이터 로드 완료 여부
      { key: 'workHistoryId', defaultValue: null as number },                   // 근무이력 ID
    ]);
  }

}