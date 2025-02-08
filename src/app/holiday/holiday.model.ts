import { HttpRequestDTOBase } from '@app/shared/models';

/** 휴일 조회 요청 DTO */
export class GetHolidayRequestDTO extends HttpRequestDTOBase {

  /** 일자 */
  ymd?: string;

  /** 사용자 ID */
  userId?: number;

  /** 연도 */
  yyyy?: string;

  /** 월 */
  mm?: string;

  /** 일 */
  dd?: string;

}

/** 휴일 추가/수정 요청 DTO */
export class SaveHolidayRequestDTO extends HttpRequestDTOBase {

  /** 기존 일자 */
  originalYmd?: string;

  /** 일자 */
  ymd?: string;

  /** 사용자 ID */
  userId?: number;

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

/** 휴일 조회 결과 DTO */
export class HolidayResultDTO {

  /** 일자 */
  ymd?: string;

  /** 사용자 ID */
  userId?: number;

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


/** 휴일 응답 DTO */
export class HolidayResponseDTO {

  /** 휴일 */
  holiday?: HolidayResultDTO;

  /** 휴일 목록 */
  holidayList?: HolidayResultDTO[];

}
