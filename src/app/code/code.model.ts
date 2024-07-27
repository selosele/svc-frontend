/** 코드 응답 DTO */
export class CodeResponseDTO {

  /** 코드 ID */
  codeId?: string;

  /** 상위 코드 ID */
  upCodeId?: string;
  
  /** 코드 값 */
  codeValue?: string;
  
  /** 코드 명 */
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