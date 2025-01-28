import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { BoardResponseDTO } from './board.model';

@Injectable({ providedIn: 'root' })
export class BoardStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'boardList', defaultValue: [] as BoardResponseDTO[] }, // 게시판 목록
      { key: 'boardListDataLoad', defaultValue: false },            // 게시판 목록 데이터 로드 완료 여부
    ]);
  }

}