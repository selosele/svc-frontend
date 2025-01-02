import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class UiDialogService {

  constructor(
    private dialogService: DialogService,
  ) {}

  /** modal을 표출한다. */
  open(componentType: Type<unknown>, config: DynamicDialogConfig): DynamicDialogRef<unknown> {
    return this.dialogService.open(componentType, config);
  }

  /** 모든 modal을 닫는다. */
  closeAllDialog(): void {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => {
      dialog.destroy();
    });
  }

}
