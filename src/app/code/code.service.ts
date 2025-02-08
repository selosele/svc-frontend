import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { CodeResponseDTO, CodeResultDTO, CodeTree, SaveCodeRequestDTO } from './code.model';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { CodeStore } from './code.store';

@Injectable({ providedIn: 'root' })
export class CodeService {

  constructor(
    private http: HttpClient,
    private codeStore: CodeStore,
  ) {}

  /** 코드 목록 데이터를 설정한다. */
  setCodeList(codeList: CodeResultDTO[]): void {
    const codeTree = this.createCodeTree(codeList);
    this.codeStore.update('codeTree', codeTree);
    this.codeStore.update('codeList', codeList);
  }

  /** 코드 목록을 조회한다. */
  listCode$() {
    return this.http.get<CodeResponseDTO>('/co/codes').pipe(
      tap((response) => {
        this.setCodeList(response.codeList);
        this.codeStore.update('codeListDataLoad', true);
      })
    );
  }

  /** 코드를 조회한다. */
  getCode$(codeId: string) {
    return this.http.get<CodeResponseDTO>(`/co/codes/${codeId}`);
  }

  /** 코드를 추가한다. */
  addCode$(dto: SaveCodeRequestDTO) {
    return this.http.post<CodeResponseDTO>('/co/codes', dto);
  }

  /** 코드를 수정한다. */
  updateCode$(dto: SaveCodeRequestDTO) {
    const { codeId } = dto;
    return this.http.put<CodeResponseDTO>(`/co/codes/${codeId}`, dto);
  }

  /** 코드를 삭제한다. */
  removeCode$(codeId: string) {
    return this.http.delete<void>(`/co/codes/${codeId}`);
  }

  /** 상위 코드 ID로 코드 데이터 목록을 만들어서 반환한다. */
  createCodeData(upCodeId: string): DropdownData[] {
    return this.codeStore.select<CodeResultDTO[]>('codeList').value
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
  createCodeTree(data: CodeResultDTO[], upCodeId = null): CodeTree[] {
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
