import { HttpRequestDTOBase } from '@app/shared/models';

/** 게시글 조회 요청 DTO */
export class GetArticleRequestDTO extends HttpRequestDTOBase {

  /** 게시글 ID */
  articleId?: number;

  /** 게시판 ID */
  boardId?: number;

}

/** 게시글 응답 DTO */
export class ArticleResponseDTO {

  /** 게시글 ID */
  articleId?: number;

  /** 게시판 ID */
  boardId?: number;

  /** 게시글 제목 */
  articleTitle?: string;

  /** 게시글 내용 */
  articleContent?: string;

  /** 게시글 작성자 ID */
  articleWriterId?: number;

  /** 게시글 작성자명 */
  articleWriterName?: number;

  /** 게시글 내용 */
  boardContent?: string;

  /** 게시판 구분 코드 */
  boardTypeCode?: string;

  /** 등록일시 */
  createDt?: string;

}