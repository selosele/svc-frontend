/** 코드 응답 DTO */
export class CodeResponseDTO {

  /** 코드 ID */
  codeId?: string;

  /** 상위 코드 ID */
  upCodeId?: string;
  
  /** 코드 값 */
  codeValue?: string;
  
  /** 코드명 */
  codeName?: string;
  
  /** 코드 내용 */
  codeContent?: string;
  
  /** 코드 순서 */
  codeOrder?: number;
  
  /** 코드 뎁스 */
  codeDepth?: number;
  
  /** 사용 여부 */
  useYn?: string;
  
  /** 삭제 여부 */
  deleteYn?: string;
    
}

/** 코드 트리 */
export class CodeTree extends CodeResponseDTO {

  /** 코드 */
  data?: CodeResponseDTO;

  /** 하위 코드 목록 */
  children?: CodeResponseDTO[];

  /** 확장 여부 */
  expanded?: boolean = false;

}
