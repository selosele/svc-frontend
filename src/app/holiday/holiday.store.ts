import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { HolidayResponseDTO } from './holiday.model';

@Injectable({ providedIn: 'root' })
export class HolidayStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'holidayList', defaultValue: [] as HolidayResponseDTO[] }, // 휴일 목록
      { key: 'holidayListDataLoad', defaultValue: false },              // 휴일 목록 데이터 로드 완료 여부
    ]);
  }

}