/** 권한 조회 결과 DTO */
export class RoleResultDTO {

  /** 권한 ID */
  roleId?: string;

  /** 권한명 */
  roleName?: string;

  /** 권한 순서 */
  roleOrder?: number;
    
}

/** 권한 응답 DTO */
export class RoleResponseDTO {

  /** 권한 */
  role?: RoleResultDTO;

  /** 권한 목록 */
  roleList?: RoleResultDTO[];
    
}
