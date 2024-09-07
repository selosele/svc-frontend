import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CodeResponseDTO, CodeTree, SaveCodeRequestDTO } from './code.model';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Injectable({ providedIn: 'root' })
export class CodeService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 코드 목록 */
  codeList = new BehaviorSubject<CodeResponseDTO[]>([]);
  codeList$ = this.codeList.asObservable();

  /** 코드 목록 데이터 로드 완료 여부 */
  codeListDataLoad = new BehaviorSubject<boolean>(false);
  codeListDataLoad$ = this.codeListDataLoad.asObservable();

  /** 코드 트리 목록 */
  codeTree = new BehaviorSubject<CodeTree[]>([]);
  codeTree$ = this.codeTree.asObservable();

  /** 코드 목록 데이터를 설정한다. */
  setCodeList(codeList: CodeResponseDTO[]): void {
    const codeTree = this.createCodeTree(codeList);
    this.codeTree.next(codeTree);
    this.codeList.next(codeList);
  }

  /** 코드 목록을 조회한다. */
  listCode(): Observable<CodeResponseDTO[]> {
    return this.http.get<CodeResponseDTO[]>('/common/codes').pipe(
      tap((data) => {
        this.setCodeList(data);
        this.codeListDataLoad.next(true);
      })
    );
  }

  /** 코드를 조회한다. */
  getCode$(codeId: string): Observable<CodeResponseDTO> {
    return this.http.get<CodeResponseDTO>(`/common/codes/${codeId}`);
  }

  /** 코드를 추가한다. */
  addCode$(dto: SaveCodeRequestDTO): Observable<CodeResponseDTO> {
    return this.http.post<CodeResponseDTO>('/common/codes', dto);
  }

  /** 코드를 수정한다. */
  updateCode$(dto: SaveCodeRequestDTO): Observable<CodeResponseDTO> {
    const { codeId } = dto;
    return this.http.put<CodeResponseDTO>(`/common/codes/${codeId}`, dto);
  }

  /** 코드를 삭제한다. */
  removeCode$(codeId: string): Observable<void> {
    return this.http.delete<void>(`/common/codes/${codeId}`);
  }

  /** 상위 코드 ID로 코드 데이터 목록을 만들어서 반환한다. */
  createCodeData(upCodeId: string): DropdownData[] {
    return this.codeList.value
      .filter(x => x.upCodeId === upCodeId)
      .map(x => ({ label: x.codeName, value: x.codeValue })
    );
  }

  /** Y/N 코드 데이터 목록을 만들어서 반환한다. */
  createYnCodeData(): DropdownData[] {
    return [
      { label: 'Y', value: 'Y' },
      { label: 'N', value: 'N' }
    ];
  }

  /** 코드 트리를 생성한다. */
  createCodeTree(data: CodeResponseDTO[], upCodeId = null): CodeTree[] {
    const tree: CodeTree[] = [];

    for (const code of data) {
      if (code.upCodeId === upCodeId) {
        const children = this.createCodeTree(data, code.codeId);
        tree.push({ data: code, children, expanded: false });
      }
    }
    return tree;
  }

}
