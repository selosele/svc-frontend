import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodeResponseDTO, CodeTree } from './code.model';
import { DropdownData } from '@app/shared/models';

@Injectable({ providedIn: 'root' })
export class CodeService {

  constructor(
    private http: HttpClient,
  ) {}

  codeListSubject = new BehaviorSubject<CodeResponseDTO[]>([]);
  codeListDataLoadSubject = new BehaviorSubject<boolean>(false);
  codeTreeSubject = new BehaviorSubject<CodeTree[]>([]);

  /** 코드 목록 */
  codeList$ = this.codeListSubject.asObservable();

  /** 코드 목록 데이터 로드 완료 여부 */
  codeListDataLoad$ = this.codeListDataLoadSubject.asObservable();

  /** 코드 목록 */
  codeTree$ = this.codeTreeSubject.asObservable();

  /** 코드 목록 데이터를 설정한다. */
  setCodeList(codeList: CodeResponseDTO[]): void {
    const codeTree = this.createCodeTree(codeList);
    this.codeTreeSubject.next(codeTree);
    this.codeListSubject.next(codeList);
  }

  /** 코드 목록을 조회한다. */
  listCode(): void {
    this.http.get<CodeResponseDTO[]>('/codes')
    .subscribe((data) => {
      this.setCodeList(data);
      this.codeListDataLoadSubject.next(true);
    });
  }

  /** 코드를 조회한다. */
  getCode(codeId: string): Observable<CodeResponseDTO> {
    return this.http.get<CodeResponseDTO>(`/codes/${codeId}`);
  }

  /** 상위 코드 ID로 드롭다운 데이터를 만들어서 반환한다. */
  getDropdownData(upCodeId: string): DropdownData[] {
    return this.codeListSubject.value
      .filter(x => x.upCodeId === upCodeId)
      .map(x => ({ label: x.codeName, value: x.codeValue })
    );
  }

  /** Y/N 드롭다운 데이터를 만들어서 반환한다. */
  getDropdownYnData(): DropdownData[] {
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
