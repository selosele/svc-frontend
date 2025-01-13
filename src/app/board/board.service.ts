import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '@app/shared/services';
import { BoardResponseDTO, SaveBoardRequestDTO } from './board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {

  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  /** 게시판 목록 */
  private boardList = this.store.create<BoardResponseDTO[]>('boardList', []);

  /** 게시판 목록 데이터 로드 완료 여부 */
  private boardListDataLoad = this.store.create<boolean>('boardListDataLoad', false);

  /** 게시판 목록을 조회한다. */
  listBoard(): void {
    this.http.get<BoardResponseDTO[]>('/co/boards')
    .subscribe((data) => {
      this.store.update('boardList', data);
      this.store.update('boardListDataLoad', true);
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
