/** 메뉴 조회 요청 DTO */
export class GetMenuRequestDTO {

  /** 메뉴 ID */
  MenuId?: number;

  /** 상위 메뉴 ID */
  upMenuId?: number;

  /** 메뉴 표출여부 */
  menuShowYn?: string = 'Y';

  /** 메뉴 사용여부 */
  menuUseYn?: string = 'Y';

  /** 메뉴 삭제여부 */
  menuDeleteYn?: string = 'N';

}

/** 메뉴 응답 DTO */
export class MenuResponseDTO {

  /** 메뉴 ID */
  menuId?: number;
  
  /** 상위 메뉴 ID */
  upMenuId?: number;
  
  /** 메뉴 명 */
  menuName?: string;
  
  /** 메뉴 URL */
  menuUrl?: string;
  
  /** 메뉴 순서 */
  menuOrder?: number;
  
  /** 메뉴 뎁스 */
  menuDepth?: number;
  
  /** 메뉴 표출여부 */
  menuShowYn?: string;
  
  /** 메뉴 사용여부 */
  menuUseYn?: string;
  
  /** 메뉴 삭제여부 */
  menuDeleteYn?: string;
    
}
