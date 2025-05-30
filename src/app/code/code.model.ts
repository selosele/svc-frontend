import { Transform } from 'class-transformer';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { HttpRequestDTOBase } from '@app/shared/models';
import { isNotEmpty } from '@app/shared/utils';

/** 코드 추가/수정 요청 DTO DTO */
export class SaveCodeRequestDTO extends HttpRequestDTOBase {

  /** 기존 코드 ID */
  originalCodeId?: string;

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
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  codeOrder?: number;
  
  /** 코드 뎁스 */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  codeDepth?: number;

  /** 사용자 ID */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  userId?: number;
    
}

/** 코드 조회 결과 DTO */
export class CodeResultDTO {

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

  /** 사용자 ID */
  userId?: number;
    
}

/** 코드 응답 DTO */
export class CodeResponseDTO {

  /** 코드 */
  code?: CodeResultDTO;

  /** 코드 목록 */
  codeList?: CodeResultDTO[];
    
}

/** 코드 트리 */
export class CodeTree extends CodeResultDTO {

  /** 코드 */
  data?: CodeResultDTO;

  /** 하위 코드 목록 */
  children?: CodeTree[];

  /** 확장 여부 */
  expanded?: boolean = false;

}

/** 코드 리졸버 반환 타입 */
export interface CodeResolverModel {

  /** key: 상위 코드 ID, value: 드롭다운 데이터 목록 */
  [upcodeId: string]: DropdownData[];

}
