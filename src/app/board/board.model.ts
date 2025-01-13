import { HttpRequestDTOBase } from '@app/shared/models';

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

}

/** 게시판 응답 DTO */
export class BoardResponseDTO {

  /** 게시판 ID */
  boardId?: number;

  /** 게시판명 */
  boardName?: string;

  /** 게시판 내용 */
  boardContent?: string;

  /** 게시판 구분 코드 */
  boardTypeCode?: string;

  /** 사용 여부 */
  useYn?: string;

}