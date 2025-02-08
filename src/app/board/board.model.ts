import { HttpRequestDTOBase } from '@app/shared/models';
import { Transform } from 'class-transformer';
import { isNotEmpty } from '@app/shared/utils';

/** 게시판 조회 요청 DTO */
export class GetBoardRequestDTO extends HttpRequestDTOBase {

  /** 메인 화면 표출 여부 */
  mainShowYn?: string;

}

/** 게시판 추가/수정 요청 DTO */
export class SaveBoardRequestDTO extends HttpRequestDTOBase {

  /** 게시판 ID */
  boardId?: number;

  /** 게시판명 */
  boardName?: string;

  /** 게시판 내용 */
  boardContent?: string;

  /** 게시판 구분 코드 */
  boardTypeCode?: string;

  /** 게시판 순서 */
  @Transform(({ value }) => (isNotEmpty(value) ? Number(value) : null))
  boardOrder?: number;

  /** 메인 화면 표출 여부 */
  mainShowYn?: string;

}

/** 게시판 조회 결과 DTO */
export class BoardResultDTO {

  /** 게시판 ID */
  boardId?: number;

  /** 게시판명 */
  boardName?: string;

  /** 게시판 내용 */
  boardContent?: string;

  /** 게시판 구분 코드 */
  boardTypeCode?: string;

  /** 게시판 구분 코드명 */
  boardTypeCodeName?: string;

  /** 게시판 순서 */
  boardOrder?: number;

  /** 메인 화면 표출 여부 */
  mainShowYn?: string;

  /** 사용 여부 */
  useYn?: string;

  /** 게시글 개수 */
  articleCount?: number;

}

/** 게시판 응답 DTO */
export class BoardResponseDTO {

  /** 게시판 */
  board?: BoardResultDTO;

  /** 게시판 목록 */
  boardList?: BoardResultDTO[];

}