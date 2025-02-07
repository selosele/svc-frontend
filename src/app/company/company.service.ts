import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/shared/services';
import { CompanyStore } from './company.store';
import { CompanyApplyResponseDTO, CompanyOpenAPIResponseDTO, CompanyResponseDTO, GetCompanyApplyRequestDTO, GetCompanyRequestDTO, SaveCompanyApplyRequestDTO, SaveCompanyRequestDTO } from './company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private companyStore: CompanyStore,
  ) {}

  /** 회사 목록을 조회한다. */
  listCompany(dto?: GetCompanyRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<CompanyResponseDTO[]>('/hm/companies', { params })
    .subscribe((response) => {
      this.companyStore.update('companyList', response);
      this.companyStore.update('companyListDataLoad', true);
    });
  }

  /** 회사를 조회한다. */
  getCompany$(companyId: number) {
    return this.http.get<CompanyResponseDTO>(`/hm/companies/${companyId}`);
  }

  /** 회사를 추가한다. */
  addCompany$(dto: SaveCompanyRequestDTO) {
    return this.http.post<CompanyResponseDTO>('/hm/companies', dto);
  }

  /** 회사를 수정한다. */
  updateCompany$(dto: SaveCompanyRequestDTO) {
    const { companyId } = dto;
    return this.http.put<void>(`/hm/companies/${companyId}`, dto);
  }

  /** 회사를 삭제한다. */
  removeCompany$(companyId: number) {
    return this.http.delete<void>(`/hm/companies/${companyId}`);
  }

  /** Open API로 회사 목록을 조회한다. */
  listCompanyOpenAPI$(dto?: GetCompanyRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<CompanyOpenAPIResponseDTO[]>('/public/hm/companies', { params });
  }

  /** 회사등록신청 목록을 조회한다. */
  listCompanyApply(dto?: GetCompanyApplyRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<CompanyApplyResponseDTO[]>('/hm/company-applies', { params })
    .subscribe((response) => {
      this.companyStore.update('companyApplyList', response);
      this.companyStore.update('companyApplyListDataLoad', true);
    });
  }

  /** 회사등록신청을 조회한다. */
  getCompanyApply$(companyApplyId: number) {
    return this.http.get<CompanyApplyResponseDTO>(`/hm/company-applies/${companyApplyId}`);
  }

  /** 회사등록신청을 추가한다. */
  addCompanyApply$(dto: SaveCompanyApplyRequestDTO) {
    return this.http.post<void>('/hm/company-applies', dto);
  }

  /** 회사등록신청을 수정한다. */
  updateCompanyApply$(dto: SaveCompanyApplyRequestDTO) {
    const { companyApplyId } = dto;
    return this.http.put<void>(`/hm/company-applies/${companyApplyId}`, dto);
  }

}
