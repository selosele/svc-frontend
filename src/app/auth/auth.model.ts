import { HttpRequestDTOBase } from '@app/shared/models';
import { EmployeeResponseDTO, SaveEmployeeRequestDTO } from '@app/human/human.model';

/** 로그인 요청 DTO */
export class LoginRequestDTO extends HttpRequestDTOBase {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

  /** 아이디 저장 여부 */
  saveUserAccountYn?: string[];

}

/** 로그인 응답 DTO */
export class LoginResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}

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

/** 사용자 비밀번호 변경 요청 DTO */
export class UpdateUserPasswordRequestDTO extends HttpRequestDTOBase {

  /** 현재 비밀번호 */
  currentPassword?: string;

  /** 변경할 비밀번호 */
  newPassword?: string;

  /** 변경할 비밀번호 확인 */
  newPasswordConfirm?: string;

}

/** 권한 응답 DTO */
export class RoleResponseDTO {

  /** 권한 ID */
  roleId?: string;

  /** 권한명 */
  roleName?: string;

  /** 권한 순서 */
  roleOrder?: number;
    
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

/** 사용자 아이디 찾기 요청 DTO */
export class FindUserAccountRequestDTO extends HttpRequestDTOBase {

  /** 직원명 */
  employeeName?: string;

  /** 이메일주소 */
  emailAddr?: string;
    
}

/** 사용자 아이디 찾기 응답 DTO */
export class FindUserAccountResponseDTO {

  /** 사용자 계정 */
  userAccount?: number;

  /** 직원명 */
  employeeName?: string;

  /** 등록일시 */
  createDt?: string;

  /** 마지막 로그인 일시 */
  lastLoginDt?: string;
    
}

/** 인증된 사용자 정보 */
export class AuthenticatedUser {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 근무이력 ID */
  workHistoryId?: number;

  /** 회사명 */
  companyName?: string;

  /** 직위 코드 */
  rankCode?: string;

  /** 직위 코드명 */
  rankCodeName?: string;

  /** 직책 코드 */
  jobTitleCode?: string;

  /** 직책 코드명 */
  jobTitleCodeName?: string;

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 사용자 권한 목록 */
  roles?: string[];

}

