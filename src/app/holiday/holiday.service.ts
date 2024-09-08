import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HolidayResponseDTO, SaveHolidayRequestDTO } from './holiday.model';

@Injectable({ providedIn: 'root' })
export class HolidayService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 휴일 목록 */
  holidayList = new BehaviorSubject<HolidayResponseDTO[]>([]);
  holidayList$ = this.holidayList.asObservable();

  /** 휴일 목록 데이터 로드 완료 여부 */
  holidayListDataLoad = new BehaviorSubject<boolean>(false);
  holidayListDataLoad$ = this.holidayListDataLoad.asObservable();

  /** 휴일 목록을 조회한다. */
  listHoliday(): void {
    this.http.get<HolidayResponseDTO[]>('/common/holidays')
    .subscribe((data) => {
      this.holidayList.next(data);
      this.holidayListDataLoad.next(true);
    });
  }

  /** 휴일을 조회한다. */
  getHoliday$(ymd: string): Observable<HolidayResponseDTO> {
    return this.http.get<HolidayResponseDTO>(`/common/holidays/${ymd}`);
  }

  /** 휴일을 추가한다. */
  addHoliday$(dto: SaveHolidayRequestDTO): Observable<HolidayResponseDTO> {
    return this.http.post<HolidayResponseDTO>('/common/holidays', dto);
  }

  /** 휴일을 수정한다. */
  updateHoliday$(dto: SaveHolidayRequestDTO): Observable<HolidayResponseDTO> {
    const { ymd } = dto;
    return this.http.put<HolidayResponseDTO>(`/common/holidays/${ymd}`, dto);
  }

  /** 휴일을 삭제한다. */
  removeHoliday$(ymd: string): Observable<void> {
    return this.http.delete<void>(`/common/holidays/${ymd}`);
  }

}
