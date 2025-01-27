import { Transform } from 'class-transformer';
import { isNotEmpty } from '@app/shared/utils';
import { HttpRequestDTOBase } from '@app/shared/models';

/** 휴가 조회 요청 DTO */
export class GetVacationRequestDTO extends HttpRequestDTOBase {

  /** 휴가 ID */
  vacationId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 사용자 ID */
  userId?: number;

}

/** 휴가 추가/수정 요청 DTO */
export class SaveVacationRequestDTO extends HttpRequestDTOBase {

  /** 휴가 ID */
  vacationId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 휴가 내용 */
  vacationContent?: string;

  /** 휴가 사용일수 */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  vacationUseCount?: number;

}

/** 휴가 응답 DTO */
export class VacationResponseDTO {

  /** 휴가 ID */
  vacationId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 구분 코드명 */
  vacationTypeCodeName?: string;

  /** 휴가 내용 */
  vacationContent?: string;

  /** 휴가 시작일자 */
  vacationStartYmd?: string;

  /** 휴가 종료일자 */
  vacationEndYmd?: string;

  /** 휴가 사용일수 */
  vacationUseCount?: number;

  /** 삭제 여부 */
  deleteYn?: string;

}

/** 휴가 계산 설정 추가 요청 DTO */
export class AddVacationCalcRequestDTO extends HttpRequestDTOBase {

  /** 근무이력 ID */
  workHistoryId?: number;
  
  /** 직원 ID */
  employeeId?: number;
  
  /** 휴가 내용 */
  annualTypeCode?: string;

  /** 휴가 구분 코드 목록 */
  vacationTypeCodes?: string[];

}

/** 휴가 계산 설정 응답 DTO */
export class VacationCalcResponseDTO {

  /** 휴가 계산 설정 ID */
  vacationCalcId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 직원 ID */
  employeeId?: number;
  
  /** 휴가 내용 */
  annualTypeCode?: string;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

}

/** 휴가 통계 조회 요청 DTO */
export class GetVacationStatsRequestDTO extends HttpRequestDTOBase {

  /** 사용자 ID */
  userId?: number;
  
  /** 직원 ID */
  employeeId?: number;

}

/** 휴가 통계 조회 결과 DTO */
export class VacationStatsResultDTO {

  /** 휴가 통계 ID */
  vacationStatsId?: number;

  /** 직원 ID */
  employeeId?: number;

  /** 근무이력 ID */
  workHistoryId?: number;
  
  /** 연도 */
  yyyy?: string;

  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

  /** 휴가 구분 코드명 */
  vacationTypeCodeName?: string;

  /** 휴가 사용 일수 */
  vacationUseCount?: number;

}

/** 휴가일수정보 조회 결과 DTO */
export class VacationCountInfoResultDTO {

  /** 총 휴가 일수 */
  vacationTotalCount?: number;

  /** 휴가 사용 일수 */
  vacationUseCount?: number;

  /** 잔여 휴가 일수 */
  vacationRemainCount?: number;

}

/** 휴가 통계 응답 DTO */
export class VacationStatsResponseDTO {

  /** 휴가일수정보 */
  countInfo?: VacationCountInfoResultDTO;

  /** 휴가 통계 목록 */
  statsList?: VacationStatsResultDTO[];

  /** 휴가 목록 */
  vacationList?: VacationResponseDTO[];

}

/** 월별 휴가사용일수 조회 요청 DTO */
export class GetVacationByMonthRequestDTO extends HttpRequestDTOBase {

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 휴가사용연도 */
  yyyy?: string;
  
  /** 휴가 구분 코드 */
  vacationTypeCode?: string;

}

/** 월별 휴가사용일수 응답 DTO */
export class VacationByMonthResponseDTO {

  /** 휴가 사용일수 */
  vacationUseCount?: number;

  /** 휴가 사용 월 */
  vacationMonth?: string;

}

/** 휴가 상태관리 DTO */
export class VacationDataStateDTO {

  /** 근무이력 탭별 휴가 목록 및 데이터 로드 완료 여부 */
  [key: number]: {
    data: VacationResponseDTO[],
    dataLoad: boolean,
  };

}