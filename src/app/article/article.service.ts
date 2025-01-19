import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService, StoreService } from '@app/shared/services';
import { ArticleDataStateDTO, ArticleResponseDTO, ArticleResultDTO, GetArticleRequestDTO, SaveArticleRequestDTO } from './article.model';
import { roles } from '@app/shared/utils';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private store: StoreService,
  ) {}

  /** 게시글 및 게시판 정보 */
  private articleResponse = this.store.create<ArticleDataStateDTO>('articleResponse', null);

  /** 게시글 목록을 조회한다. */
  listArticle$(dto: GetArticleRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<ArticleResponseDTO>('/co/articles', { params });
  }

  /** 게시글을 조회한다. */
  getArticle$(articleId: number) {
    return this.http.get<ArticleResponseDTO>(`/co/articles/${articleId}`);
  }

  /** 게시글을 추가한다. */
  addArticle$(dto: SaveArticleRequestDTO) {
    return this.http.post<ArticleResponseDTO>('/co/articles', dto);
  }

  /** 게시글을 수정한다. */
  updateArticle$(dto: SaveArticleRequestDTO) {
    const { articleId } = dto;
    return this.http.put<void>(`/co/articles/${articleId}`, dto);
  }

  /** 게시글을 삭제한다. */
  removeArticle$(articleId: number) {
    return this.http.delete<void>(`/co/articles/${articleId}`);
  }

  /** 게시글 작성자명을 반환한다. */
  getArticleWriterName(data: ArticleResultDTO): string {

    // 1. 작성자가 시스템관리자인 경우
    if (data.isSystemAdmin === 1) {

      // 닉네임이 있으면 닉네임을 반환하고, 없으면 "시스템관리자" 권한명을 반환
      return data.articleWriterNickname ?? `<strong>${roles.SYSTEM_ADMIN.name}</strong>`;
    }
    // 2. 작성자가 시스템관리자가 아닌 경우
    return data.articleWriterNickname ?? data.employeeName;
  }

}
