import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { CodeResultDTO, CodeTree } from './code.model';

@Injectable({ providedIn: 'root' })
export class CodeStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'codeList', defaultValue: [] as CodeResultDTO[] }, // 코드 목록
      { key: 'codeListDataLoad', defaultValue: false },         // 코드 목록 데이터 로드 완료 여부
      { key: 'codeTree', defaultValue: [] as CodeTree[] },      // 코드 트리 목록
    ]);
  }

}