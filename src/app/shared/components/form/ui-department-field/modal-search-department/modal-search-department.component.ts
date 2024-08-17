import { Component, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentResponseDTO } from '@app/human/human.model';
import { HumanService } from '@app/human/human.service';
import { UiFormComponent } from '../../ui-form/ui-form.component';
import { UiTextFieldComponent } from '../../ui-text-field/ui-text-field.component';
import { UiButtonComponent, UiSkeletonComponent, UiTreeTableComponent } from '../../../ui';
import { LayoutPageDescriptionComponent } from '../../../layout';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    UiTreeTableComponent,
    UiSkeletonComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'modal-search-department',
  templateUrl: './modal-search-department.component.html',
  styleUrl: './modal-search-department.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalSearchDepartmentComponent {

  constructor(
    private humanService: HumanService,
    private dialogRef: DynamicDialogRef,
  ) {}

  /** 부서 트리 목록 */
  get departmentTree(): DepartmentResponseDTO[] {
    return this.humanService.departmentTree.value;
  }

  /** 부서 목록 */
  get departmentList(): DepartmentResponseDTO[] {
    return this.humanService.departmentList.value;
  }

  /** 부서 목록 데이터 로드 완료 여부 */
  get departmentListDataLoad(): boolean {
    return this.humanService.departmentListDataLoad.value;
  }

  /** 테이블 컬럼 */
  cols = [
    { field: 'companyName',      header: '회사명' },
    { field: 'departmentName',   header: '부서명' },
    { field: 'departmentOrder',  header: '부서 순서' },
  ];

  ngOnInit(): void {
    if (!this.departmentListDataLoad) {
      this.listDepartment();
    }
  }

  /** 부서 목록을 조회한다. */
  listDepartment(): void {
    this.humanService.listDepartment({ getByCompanyYn: 'Y' });
  }

  /** 부서를 검색한다. */
  onSubmit(value: DepartmentResponseDTO): void {
    this.humanService.listDepartment(value);
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listDepartment();
  }

  /** 테이블 행을 더블 클릭한다. */
  onRowDblClick(rowData: DepartmentResponseDTO): void {
    const departmentListByMyCompany = this.departmentList.filter(x => x.companyId === rowData.companyId);
    const departmentNames = this.humanService.findDepartmentName(
      this.humanService.findDepartments(departmentListByMyCompany, rowData.departmentId)
    );
    this.dialogRef.close({ rowData, departmentNames });
  }

}
