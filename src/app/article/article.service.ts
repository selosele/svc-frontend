import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService, StoreService } from '@app/shared/services';
import { ArticleResponseDTO, GetArticleRequestDTO } from './article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private store: StoreService,
  ) {}

  /** 게시글 목록 */
  private articleList = this.store.create<ArticleResponseDTO[]>('articleList', []);

  /** 게시판 목록 데이터 로드 완료 여부 */
  private articleListDataLoad = this.store.create<boolean>('articleListDataLoad', false);

  /** 게시글 목록을 조회한다. */
  listArticle$(dto: GetArticleRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<ArticleResponseDTO[]>('/co/articles', { params });
  }

}
