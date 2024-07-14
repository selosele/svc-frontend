import { EmployeeResponseDTO } from "@app/human/human.dto";

/** 로그인 요청 DTO */
export interface LoginRequestDTO {

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 비밀번호 */
  userPassword?: string;

}

/** 로그인 응답 DTO */
export interface LoginResponseDTO {

  /** 액세스 토큰 */
  accessToken?: string;

}

/** 사용자 수정 요청 DTO */
export class UpdateUserRequestDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 명 */
  userName?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;
    
}

/** 사용자 응답 DTO */
export class UserResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 명 */
  userName?: string;

  /** 사용자 활성화 여부 */
  userActiveYn?: string;

  /** 사용자 권한 목록 */
  roles?: string[] | UserRoleResponseDTO[];

  /** 직원 정보 */
  employee?: EmployeeResponseDTO;
    
}

/** 권한 응답 DTO */
export class RoleResponseDTO {

  /** 권한 ID */
  roleId?: string;

  /** 권한 명 */
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

  /** 권한 명 */
  roleName?: string;
    
}

