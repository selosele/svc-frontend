import { Transform } from 'class-transformer';
import { HttpRequestDTOBase } from '@app/shared/models';
import { isNotEmpty } from '@app/shared/utils';

/** 메뉴 조회 요청 DTO */
export class GetMenuRequestDTO extends HttpRequestDTOBase {

  /** 메뉴 ID */
  menuId?: number;

  /** 상위 메뉴 ID */
  upMenuId?: number;

  /** 권한 ID 목록 */
  roleIdList?: string[];

}

/** 메뉴 추가/수정 요청 DTO */
export class SaveMenuRequestDTO extends HttpRequestDTOBase {

  /** 기존 메뉴 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  originalMenuId?: number;

  /** 메뉴 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  menuId?: number;

  /** 상위 메뉴 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  upMenuId?: number;

  /** 메뉴명 */
  menuName?: string;

  /** 메뉴 URL */
  menuUrl?: string;

  /** 메뉴 순서 */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  menuOrder?: number;

  /** 메뉴 뎁스 */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  menuDepth?: number;

  /** 메뉴 표출 여부 */
  menuShowYn?: string;

  /** 메뉴 권한 목록 */
  menuRoleList?: string[];

}

/** 메뉴 응답 DTO */
export class MenuResponseDTO {

  /** 메뉴 ID */
  menuId?: number;
  
  /** 상위 메뉴 ID */
  upMenuId?: number;
  
  /** 메뉴명 */
  menuName?: string;
  
  /** 메뉴 URL */
  menuUrl?: string;
  
  /** 메뉴 순서 */
  menuOrder?: number;
  
  /** 메뉴 뎁스 */
  menuDepth?: number;
  
  /** 메뉴 표출 여부 */
  menuShowYn?: string;
  
  /** 사용 여부 */
  useYn?: string;
  
  /** 삭제 여부 */
  deleteYn?: string;
  
  /** 메뉴 즐겨찾기 ID */
  menuBookmarkId?: number;

  /** 메뉴 권한 목록 */
  menuRoleList?: MenuRoleResultDTO[];

}

/** 메뉴 권한 조회 결과 DTO */
export class MenuRoleResultDTO {

  /** 메뉴 ID */
  menuId?: number;
  
  /** 권한 ID */
  roleId?: string;
  
  /** 권한명 */
  roleName?: string;

}

/** 메뉴 권한 응답 DTO */
export class MenuRoleResponseDTO {

  /** 메뉴 권한 */
  menuRole?: MenuRoleResultDTO;

  /** 메뉴 권한 목록 */
  menuRoleList?: MenuRoleResultDTO[];

}

/** 메뉴 즐겨찾기 추가/수정 요청 DTO */
export class SaveMenuBookmarkRequestDTO extends HttpRequestDTOBase {

  /** 메뉴 즐겨찾기 ID */
  menuBookmarkId?: number;

  /** 메뉴 ID */
  menuId?: number;

  /** 사용자 ID */
  userId?: number;

}

/** 메뉴 즐겨찾기 응답 DTO */
export class MenuBookmarkResponseDTO {

  /** 메뉴 즐겨찾기 ID */
  menuBookmarkId?: number;

  /** 메뉴 ID */
  menuId?: number;

  /** 사용자 ID */
  userId?: number;

  /** 메뉴명 */
  menuName?: string;

  /** 메뉴 URL */
  menuUrl?: string;

}

/** 메뉴 트리 */
export class MenuTree extends MenuResponseDTO {

  /** 메뉴 */
  data?: MenuResponseDTO;

  /** 하위 메뉴 목록 */
  children?: MenuTree[];

  /** 확장 여부 */
  expanded?: boolean = false;

}
