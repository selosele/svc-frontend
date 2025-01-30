import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { Tab } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { BoardResponseDTO } from './board.model';

@Injectable({ providedIn: 'root' })
export class BoardStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'boardList', defaultValue: [] as BoardResponseDTO[] },     // 게시판 목록
      { key: 'boardListDataLoad', defaultValue: false },                // 게시판 목록 데이터 로드 완료 여부
      { key: 'mainBoardList', defaultValue: [] as BoardResponseDTO[] }, // 게시판 목록
      { key: 'mainBoardListDataLoad', defaultValue: false },            // 게시판 목록 데이터 로드 완료 여부
      { key: 'mainBoardTabList', defaultValue: [] as Tab[] },           // 게시판 탭 목록
      { key: 'mainBoardTabIndex', defaultValue: null as number },       // 선택된 게시판 탭의 index
      { key: 'mainBoardTabKey', defaultValue: null as number },         // 선택된 게시판 탭의 게시판 ID
    ]);
  }

}