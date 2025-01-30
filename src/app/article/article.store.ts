import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { ArticleDataStateDTO, ArticleResultDTO } from './article.model';

@Injectable({ providedIn: 'root' })
export class ArticleStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'articleResponse', defaultValue: null as ArticleDataStateDTO },     // 메인화면 > 게시글 및 게시판 정보
      { key: 'mainArticleResponse', defaultValue: null as ArticleDataStateDTO }, // 게시글 및 게시판 정보
      { key: 'noticeList', defaultValue: [] as ArticleResultDTO[] },             // 게시글 및 게시판 정보
      { key: 'noticeListDataLoad', defaultValue: false },                        // 로그인 화면 > 게시글 목록 데이터 로드 완료 여부
    ]);
  }

}