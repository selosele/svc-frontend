import { HttpRequestDTOBase } from '@app/shared/models';

/** 메뉴 조회 요청 DTO */
export class GetMenuRequestDTO extends HttpRequestDTOBase {

  /** 메뉴 ID */
  MenuId?: number;

  /** 상위 메뉴 ID */
  upMenuId?: number;

  /** 권한 ID 목록 */
  roleIdList?: string[];

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
