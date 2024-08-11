import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isEmpty } from '@app/shared/utils';
import { CompanyResponseDTO, DepartmentResponseDTO, DepartmentTree, EmployeeResponseDTO, GetCompanyRequestDTO, GetDepartmentRequestDTO, UpdateEmployeeRequestDTO } from './human.model';

@Injectable({ providedIn: 'root' })
export class HumanService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 직원 정보 */
  employee = new BehaviorSubject<EmployeeResponseDTO>(null);
  employee$ = this.employee.asObservable();

  /** 직원 정보 데이터 로드 완료 여부 */
  employeeDataLoad = new BehaviorSubject<boolean>(false);
  employeeDataLoad$ = this.employeeDataLoad.asObservable();

  /** 회사 목록 */
  companyList = new BehaviorSubject<CompanyResponseDTO[]>(null);
  companyList$ = this.companyList.asObservable();

  /** 회사 목록 데이터 로드 완료 여부 */
  companyListDataLoad = new BehaviorSubject<boolean>(false);
  companyListDataLoad$ = this.companyListDataLoad.asObservable();

  /** 부서 목록 */
  departmentList = new BehaviorSubject<DepartmentResponseDTO[]>(null);
  departmentList$ = this.departmentList.asObservable();

  /** 부서 목록 데이터 로드 완료 여부 */
  departmentListDataLoad = new BehaviorSubject<boolean>(false);
  departmentListDataLoad$ = this.departmentListDataLoad.asObservable();

  /** 부서 트리 목록 */
  departmentTree = new BehaviorSubject<DepartmentTree[]>([]);
  departmentTree$ = this.departmentTree.asObservable();

  /** 직원을 조회한다. */
  getEmployee(employeeId: number): void {
    this.http.get<EmployeeResponseDTO>(`/human/employees/${employeeId}`)
    .subscribe((data) => {
      this.employee.next(data);
      this.employeeDataLoad.next(true);
    });
  }

  /** 직원을 수정한다. */
  updateEmployee(updateEmployeeRequestDTO: UpdateEmployeeRequestDTO): Observable<EmployeeResponseDTO> {
    const { employeeId } = updateEmployeeRequestDTO;
    return this.http.put<EmployeeResponseDTO>(`/human/employees/${employeeId}`, updateEmployeeRequestDTO);
  }

  /** 회사 목록을 조회한다. */
  listCompany(getCompanyRequestDTO?: GetCompanyRequestDTO): void {
    this.http.get<CompanyResponseDTO[]>('/human/companies', { params: { ...getCompanyRequestDTO } })
    .subscribe((data) => {
      this.companyList.next(data);
      this.companyListDataLoad.next(true);
    });
  }

  /** 부서 목록을 조회한다. */
  listDepartment(getDepartmentRequestDTO?: GetDepartmentRequestDTO): void {
    this.http.get<DepartmentResponseDTO[]>('/human/departments', { params: { ...getDepartmentRequestDTO } })
    .subscribe((data) => {
      this.departmentTree.next(this.createDepartmentTree(data));
      this.departmentList.next(data);
      this.departmentListDataLoad.next(true);
    });
  }

  /** 부서 ID로 부서 목록을 찾아서 반환한다. */
  findDepartments(data: DepartmentResponseDTO[], departmentId: number): DepartmentResponseDTO[] {
    const list: DepartmentResponseDTO[] = [];

    // 주어진 부서 ID로부터 시작하는 부서를 찾는다.
    const targetDepartment = data.find(x => x.departmentId === departmentId);

    if (targetDepartment) {
      // 상위 부서를 찾아 재귀적으로 리스트에 추가한다.
      if (targetDepartment.upDepartmentId !== null) {
        const parentDepartments = this.findDepartments(data, targetDepartment.upDepartmentId);
        list.push(...parentDepartments);
      }

      // 현재 부서를 리스트에 추가한다.
      list.push(targetDepartment);
    }
    return list;
  }

  /** 부서 목록에서 각 부서명을 연결해서 반환한다. */
  findDepartmentName(departments: DepartmentResponseDTO[]): string {
    if (isEmpty(departments)) return '';
    return departments.map(x => x.departmentName).join(' > ');
  }

  /** 부서 트리를 생성한다. */
  createDepartmentTree(data: DepartmentResponseDTO[], upDepartmentId = null): DepartmentTree[] {
    const tree: DepartmentTree[] = [];

    for (const department of data) {
      if (department.upDepartmentId === upDepartmentId) {
        const children = this.createDepartmentTree(data, department.departmentId);
        tree.push({ data: department, children, expanded: false });
      }
    }
    return tree;
  }

}
