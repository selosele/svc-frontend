import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoardStore } from './board.store';
import { BoardResponseDTO, SaveBoardRequestDTO } from './board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {

  constructor(
    private http: HttpClient,
    private boardStore: BoardStore,
  ) {}

  /** 게시판 목록을 조회한다. */
  listBoard(): void {
    this.http.get<BoardResponseDTO[]>('/co/boards')
    .subscribe((data) => {
      this.boardStore.update('boardList', data);
      this.boardStore.update('boardListDataLoad', true);
    });
  }

  /** 게시판을 조회한다. */
  getBoard$(boardId: number) {
    return this.http.get<BoardResponseDTO>(`/co/boards/${boardId}`);
  }

  /** 게시판을 추가한다. */
  addBoard$(dto: SaveBoardRequestDTO) {
    return this.http.post<BoardResponseDTO>('/co/boards', dto);
  }

  /** 게시판을 수정한다. */
  updateBoard$(dto: SaveBoardRequestDTO) {
    const { boardId } = dto;
    return this.http.put<void>(`/co/boards/${boardId}`, dto);
  }

  /** 게시판을 삭제한다. */
  removeBoard$(boardId: number) {
    return this.http.delete<void>(`/co/boards/${boardId}`);
  }

}
