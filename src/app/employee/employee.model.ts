import { HttpRequestDTOBase } from '@app/shared/models';
import { SaveWorkHistoryRequestDTO, WorkHistoryResultDTO } from '@app/work-history/work-history.model';

/** 직원 추가/수정 요청 DTO */
export class SaveEmployeeRequestDTO extends HttpRequestDTOBase {

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 생년월일 */
  birthYmd?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 근무이력 정보 */
  workHistory?: SaveWorkHistoryRequestDTO;

}

/** 직원 조회 결과 DTO */
export class EmployeeResultDTO {

  /** 직원 ID */
  employeeId?: number;

  /** 사용자 ID */
  userId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 성별 코드 */
  genderCode?: string;

  /** 생년월일 */
  birthYmd?: string;

  /** 휴대폰번호 */
  phoneNo?: string;

  /** 이메일주소 */
  emailAddr?: string;

  /** 사용자 마지막 로그인 일시 */
  lastLoginDt?: string;

  /** 민감정보열람 동의 여부 */
  sensitiveAgreeYn?: string;

  /** 근무이력 목록 */
  workHistoryList?: WorkHistoryResultDTO[];

}

/** 직원 응답 DTO */
export class EmployeeResponseDTO {

  /** 직원 */
  employee?: EmployeeResultDTO;

  /** 직원 목록 */
  employeeList?: EmployeeResultDTO[];

}