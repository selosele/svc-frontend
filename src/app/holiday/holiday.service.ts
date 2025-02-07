import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HolidayStore } from './holiday.store';
import { HolidayResponseDTO, SaveHolidayRequestDTO } from './holiday.model';

@Injectable({ providedIn: 'root' })
export class HolidayService {

  constructor(
    private http: HttpClient,
    private holidayStore: HolidayStore,
  ) {}

  /** 휴일 목록을 조회한다. */
  listHoliday(userId: number): void {
    this.http.get<HolidayResponseDTO[]>(`/co/holidays/${userId}`)
    .subscribe((response) => {
      this.holidayStore.update('holidayList', response);
      this.holidayStore.update('holidayListDataLoad', true);
    });
  }

  /** 휴일을 조회한다. */
  getHoliday$(userId: number, ymd: string) {
    return this.http.get<HolidayResponseDTO>(`/co/holidays/${userId}/${ymd}`);
  }

  /** 휴일을 추가한다. */
  addHoliday$(dto: SaveHolidayRequestDTO) {
    const { userId } = dto;
    return this.http.post<HolidayResponseDTO>(`/co/holidays/${userId}`, dto);
  }

  /** 휴일을 수정한다. */
  updateHoliday$(dto: SaveHolidayRequestDTO) {
    const { ymd, userId } = dto;
    return this.http.put<void>(`/co/holidays/${userId}/${ymd}`, dto);
  }

  /** 휴일을 삭제한다. */
  removeHoliday$(userId: number, ymd: string) {
    return this.http.delete<void>(`/co/holidays/${userId}/${ymd}`);
  }

}
