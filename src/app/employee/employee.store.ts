import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { EmployeeResultDTO } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'employee', defaultValue: null as EmployeeResultDTO }, // 직원 정보
      { key: 'employeeDataLoad', defaultValue: false },             // 직원 정보 데이터 로드 완료 여부
    ]);
  }

}