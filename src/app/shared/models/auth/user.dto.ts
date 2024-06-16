/** 사용자 응답 DTO */
export class UserResponseDTO {

  /** 사용자 ID */
  userId?: number;

  /** 사용자 계정 */
  userAccount?: string;

  /** 사용자 명 */
  userName?: string;

  /** 사용자 권한 목록 */
  roles?: UserRoleResponseDTO[];
    
}

/** 사용자 권한 응답 DTO */
export class UserRoleResponseDTO {
  
  /** 사용자 ID */
  userId?: number;

  /** 권한 ID */
  roleId?: string;

}
