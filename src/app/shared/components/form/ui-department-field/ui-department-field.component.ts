import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UiDialogService } from '@app/shared/services';
import { DepartmentResponseDTO } from '@app/human/human.model';
import { FormFieldComponent } from '../form-field/form-field.component';
import { UiButtonComponent } from '../../ui';
import { ModalSearchDepartmentComponent } from './modal-search-department/modal-search-department.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    UiButtonComponent,
  ],
  selector: 'ui-department-field',
  templateUrl: './ui-department-field.component.html',
  styleUrl: './ui-department-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiDepartmentFieldComponent extends FormFieldComponent {

  constructor(
    private dialogService: UiDialogService,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /** 부서 검색 버튼을 클릭한다. */
  onSearch(event: Event): void {
    const modal = this.dialogService.open(ModalSearchDepartmentComponent, {
      focusOnShow: false,
      header: '부서 검색',
    });

    modal.onClose.subscribe((data: { rowData: DepartmentResponseDTO, departmentNames: string }) => {
      if (!data) return;

      if (this.formControl?.parent?.controls?.['departmentId']) {
        this.formControl.parent.controls['departmentId'].patchValue(data.rowData['departmentId']);
      }

      if (this.formControl?.parent?.controls?.['departmentName']) {
        this.formControl.parent.controls['departmentName'].patchValue(data['departmentNames']);
      }
    });
  }

}
