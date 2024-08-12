import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UiDialogService } from '@app/shared/services';
import { CompanyResponseDTO } from '@app/human/human.model';
import { FormFieldComponent } from '../form-field/form-field.component';
import { UiButtonComponent } from '../../ui';
import { ModalSearchCompanyComponent } from '../../modal';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    UiButtonComponent,
  ],
  selector: 'ui-company-field',
  templateUrl: './ui-company-field.component.html',
  styleUrl: './ui-company-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiCompanyFieldComponent extends FormFieldComponent {

  constructor(
    private dialogService: UiDialogService,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /** 회사 검색 버튼을 클릭한다. */
  onSearch(event: Event): void {
    const modal = this.dialogService.open(ModalSearchCompanyComponent, {
      focusOnShow: false,
      header: '회사 검색',
    });

    modal.onClose.subscribe((data: CompanyResponseDTO) => {
      if (!data) return;

      this.formControl?.parent?.controls?.['companyId'].patchValue(data['companyId']);
      this.formControl?.parent?.controls?.['corporateName'].patchValue(data['corporateName']);
      this.formControl?.parent?.controls?.['companyName'].patchValue(data['companyName']);
    });
  }

}