import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodeResponseDTO } from './code.model';

@Injectable({ providedIn: 'root' })
export class CodeService {

  constructor(
    private http: HttpClient,
  ) {}

  codeListSubject = new BehaviorSubject<CodeResponseDTO[]>([]);
  codeListDataLoadSubject = new BehaviorSubject<boolean>(false);

  /** 코드 목록 */
  codeList$ = this.codeListSubject.asObservable();

  /** 코드 목록 데이터 로드 완료 여부 */
  codeListDataLoad$ = this.codeListDataLoadSubject.asObservable();

  /** 코드 목록을 조회한다. */
  listCode(): void {
    this.http.get<CodeResponseDTO[]>('/codes')
    .subscribe((data) => {
      this.codeListSubject.next(data);
      this.codeListDataLoadSubject.next(true);
    });
  }

  /** 코드를 조회한다. */
  getCode(codeId: string): Observable<CodeResponseDTO> {
    return this.http.get<CodeResponseDTO>(`/codes/${codeId}`);
  }

}
