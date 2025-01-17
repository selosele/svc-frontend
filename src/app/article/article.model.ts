import { HttpRequestDTOBase } from '@app/shared/models';
import { BoardResponseDTO } from '@app/board/board.model';

/** 게시글 조회 요청 DTO */
export class GetArticleRequestDTO extends HttpRequestDTOBase {

  /** 게시글 ID */
  articleId?: number;

  /** 게시판 ID */
  boardId?: number;

}

/** 게시글 조회 결과 DTO */
export class ArticleResultDTO {

  /** 게시글 ID */
  articleId?: number;

  /** 게시글 제목 */
  articleTitle?: string;

  /** 게시글 내용 */
  articleContent?: string;

  /** 게시글 작성자 ID */
  articleWriterId?: number;

  /** 게시글 작성자명 */
  articleWriterName?: number;

  /** 게시글 작성자의 시스템관리자 권한 보유 여부 */
  isSystemAdmin?: number;

  /** 등록일시 */
  createDt?: string;

}

/** 게시글 응답 DTO */
export class ArticleResponseDTO {

  /** 게시판 */
  board?: BoardResponseDTO;

  /** 게시글 목록 */
  articleList?: ArticleResultDTO[];

}

/** 게시글 상태관리 DTO */
export class ArticleDataStateDTO {

  /** 게시판별 게시글 응답 DTO 및 데이터 로드 완료 여부 */
  [key: number]: {
    data: ArticleResponseDTO,
    dataLoaded: boolean,
  };

}