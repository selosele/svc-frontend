import { EmployeeResponseDTO, SaveEmployeeRequestDTO } from '@app/employee/employee.model';
import { HttpRequestDTOBase } from '@app/shared/models';

/** 사용자 조회 요청 DTO */
export class GetUserRequestDTO extends HttpRequestDTOBase {

  /** 권한 ID 목록 */
  roleIdList?: string[];
    
}

/** 사용자 추가/수정 요청 DTO */
export class SaveUserRequestDTO extends HttpRequestDTOBase {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;

  /** 권한 ID 목록 */
  roles?: string[];

  /** 직원 정보 */
  employee?: SaveEmployeeRequestDTO;

}

/** 사용자 응답 DTO */
export class UserResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;

  /** 마지막 로그인 일시 */
  lastLoginDt?: string;

  /** 사용자 권한 목록 */
  roles?: UserRoleResponseDTO[];

  /** 직원 정보 */
  employee?: EmployeeResponseDTO;
    
}

/** 사용자 설정 추가 요청 DTO */
export class AddUserRequestDTO extends HttpRequestDTOBase {

  /** 사용자 ID */
  userId?: number;

  /** 사이트타이틀명 */
  siteTitleName?: string;

}

/** 사용자 설정 조회 결과 DTO */
export class UserSetupResultDTO {

  /** 사용자 설정 ID */
  userSetupId?: number;

  /** 사용자 ID */
  userId?: number;

  /** 사이트타이틀명 */
  siteTitleName?: string;
    
}

/** 사용자 설정 응답 DTO */
export class UserSetupResponseDTO {

  /** 사용자 설정 */
  userSetup?: UserSetupResultDTO;

  /** 사용자 설정 목록 */
  userSetupList?: UserSetupResultDTO[];
    
}

/** 사용자 비밀번호 변경 요청 DTO */
export class UpdateUserPasswordRequestDTO extends HttpRequestDTOBase {

  /** 현재 비밀번호 */
  currentPassword?: string;

  /** 변경할 비밀번호 */
  newPassword?: string;

  /** 변경할 비밀번호 확인 */
  newPasswordConfirm?: string;

}

/** 사용자 권한 응답 DTO */
export class UserRoleResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 권한 ID */
  roleId?: string;

  /** 권한명 */
  roleName?: string;
    
}