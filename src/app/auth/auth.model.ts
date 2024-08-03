import { EmployeeResponseDTO } from '@app/human/human.model';

/** 로그인 요청 DTO */
export class LoginRequestDTO {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

}

/** 로그인 응답 DTO */
export class LoginResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}

/** 사용자 수정 요청 DTO */
export class UpdateUserRequestDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;
    
}

/** 사용자 응답 DTO */
export class UserResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;

  /** 사용자 권한 목록 */
  roles?: UserRoleResponseDTO[];

  /** 직원 정보 */
  employee?: EmployeeResponseDTO;
    
}

/** 사용자 비밀번호 변경 요청 DTO */
export class UpdateUserPasswordRequestDTO {

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

/** 인증된 사용자 정보 */
export class AuthenticatedUser {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 직원 ID */
  employeeId?: number;

  /** 직원명 */
  employeeName?: string;

  /** 사용자 권한 목록 */
  roles?: string[];

}

