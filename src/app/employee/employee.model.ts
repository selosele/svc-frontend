import { HttpRequestDTOBase } from '@app/shared/models';
import { SaveWorkHistoryRequestDTO, WorkHistoryResponseDTO } from '@app/work-history/work-history.model';

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

/** 직원 응답 DTO */
export class EmployeeResponseDTO {

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

  /** 사용자 마지막 로그인 일시 */
  lastLoginDt?: string;

  /** 근무이력 정보 */
  workHistories?: WorkHistoryResponseDTO[];

}