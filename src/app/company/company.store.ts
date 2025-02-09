import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { CompanyApplyResponseDTO, CompanyResultDTO } from './company.model';

@Injectable({ providedIn: 'root' })
export class CompanyStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'companyList', defaultValue: [] as CompanyResultDTO[] },             // 회사 목록
      { key: 'companyListDataLoad', defaultValue: false },                        // 회사 목록 데이터 로드 완료 여부
      { key: 'companyApplyList', defaultValue: [] as CompanyApplyResponseDTO[] }, // 회사등록신청 목록
      { key: 'companyApplyListDataLoad', defaultValue: false },                   // 회사등록신청 목록 데이터 로드 완료 여부
    ]);
  }

}