import { HttpRequestDTOBase } from '@app/shared/models';

/** 휴일 추가/수정 요청 DTO */
export class SaveHolidayRequestDTO extends HttpRequestDTOBase {

  /** 일자 */
  ymd?: string;

  /** 연도 */
  yyyy?: string;

  /** 월 */
  mm?: string;

  /** 일 */
  dd?: string;

  /** 휴일명 */
  holidayName?: string;

  /** 휴일 내용 */
  holidayContent?: string;

}


/** 휴일 응답 DTO */
export class HolidayResponseDTO {

  /** 일자 */
  ymd?: string;

  /** 연도 */
  yyyy?: string;

  /** 월 */
  mm?: string;

  /** 일 */
  dd?: string;

  /** 휴일명 */
  holidayName?: string;

  /** 휴일 내용 */
  holidayContent?: string;

  /** 사용 여부 */
  useYn?: string;

}