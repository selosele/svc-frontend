import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/shared/services';
import { BoardStore } from './board.store';
import { BoardResponseDTO, GetBoardRequestDTO, SaveBoardRequestDTO } from './board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private boardStore: BoardStore,
  ) {}

  /** 게시판 목록을 조회한다. */
  listBoard(dto?: GetBoardRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<BoardResponseDTO>('/co/boards', { params })
    .subscribe((response) => {
      this.boardStore.update('boardList', response);
      this.boardStore.update('boardListDataLoad', true);
    });
  }

  /** 메인화면 게시판 목록을 조회한다. */
  listMainBoard$(dto?: GetBoardRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<BoardResponseDTO>('/co/boards/main', { params });
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
