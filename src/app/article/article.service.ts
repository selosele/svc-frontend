import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService, StoreService } from '@app/shared/services';
import { ArticleDataStateDTO, ArticleResponseDTO, GetArticleRequestDTO, SaveArticleRequestDTO } from './article.model';

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
  getArticle$(dto: GetArticleRequestDTO) {
    const { articleId } = dto;
    const params = this.httpService.createParams(dto);
    return this.http.get<ArticleResponseDTO>(`/co/articles/${articleId}`, { params });
  }

  /** 게시글을 추가한다. */
  addArticle$(dto: SaveArticleRequestDTO) {
    return this.http.post<ArticleResponseDTO>('/co/articles', dto);
  }

  /** 게시글을 수정한다. */
  updateArticle$(dto: SaveArticleRequestDTO) {
    const { articleId } = dto;
    return this.http.put<ArticleResponseDTO>(`/co/articles/${articleId}`, dto);
  }

  /** 게시글을 삭제한다. */
  removeArticle$(articleId: number) {
    return this.http.delete<ArticleResponseDTO>(`/co/articles/${articleId}`);
  }

}
