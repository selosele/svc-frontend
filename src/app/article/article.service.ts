import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/shared/services';
import { ArticleStore } from './article.store';
import {
  ArticleDataStateDTO,
  ArticleResponseDTO,
  ArticleResultDTO,
  GetArticleRequestDTO,
  SaveArticleRequestDTO,
} from './article.model';
import { roles } from '@app/shared/constants';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private articleStore: ArticleStore
  ) {}

  /** 게시글 목록을 조회한다. */
  listArticle$(dto: GetArticleRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<ArticleResponseDTO>('/co/articles', { params });
  }

  /** 게시글 목록을 조회한다. */
  listArticle(boardId: number): void {
    this.listArticle$({ boardId }).subscribe((response) => {
      const oldValue =
        this.articleStore.select<ArticleDataStateDTO>('articleResponse').value;
      this.articleStore.update('articleResponse', {
        ...oldValue,
        [boardId]: { data: response, dataLoad: true }, // 게시판 ID별로 게시글 목록을 상태관리
      });
    });
  }

  /** 메인화면 게시글 목록을 조회한다. */
  listMainArticle(boardId: number, limit?: number): void {
    this.listArticle$({ boardId, limit }).subscribe((response) => {
      const oldValue = this.articleStore.select<ArticleDataStateDTO>(
        'mainArticleResponse'
      ).value;
      this.articleStore.update('mainArticleResponse', {
        ...oldValue,
        [boardId]: { data: response, dataLoad: true }, // 게시판 ID별로 게시글 목록을 상태관리
      });
    });
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

  /** 게시글 제목을 반환한다. */
  getArticleTitle(data: ArticleResultDTO, userId: number): string {
    if (data.articleWriterId === userId) {
      return `<span class="mr-2 px-2 py-1 bg-primary-50 text-primary">내가쓴글</span> ${data.articleTitle}`;
    }
    return data.articleTitle;
  }

  /** 게시글 작성자명을 반환한다. */
  getArticleWriterName(
    data: ArticleResultDTO,
    options = { tagUseYn: 'Y' }
  ): string {
    // 1. 작성자가 시스템관리자인 경우
    if (data.isSystemAdmin === 1) {
      // 닉네임이 있으면 닉네임을 반환하고, 없으면 "시스템관리자" 권한명을 반환
      if (options.tagUseYn === 'Y') {
        return (
          data.articleWriterNickname ??
          `<strong>${roles.SYSTEM_ADMIN.name}</strong>`
        );
      }
      return data.articleWriterNickname ?? roles.SYSTEM_ADMIN.name;
    }
    // 2. 작성자가 시스템관리자가 아닌 경우
    return data.articleWriterNickname ?? data.employeeName;
  }
}
