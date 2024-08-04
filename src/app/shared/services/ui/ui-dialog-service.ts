import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiDialogService {

  constructor(
    private dialogService: DialogService,
  ) {}

  /** alert 메시지 */
  alertMessage = new BehaviorSubject<string>('');
  alertMessage$ = this.alertMessage.asObservable();

  /** alert 표출 상태 */
  alertVisible = new BehaviorSubject<boolean>(false);
  alertVisible$ = this.alertVisible.asObservable();

  /** modal을 표출한다. */
  open(componentType: Type<unknown>, config: DynamicDialogConfig): DynamicDialogRef<unknown> {
    return this.dialogService.open(componentType, config);
  }

  /** alert을 표출한다. */
  alert(message: string): void {
    this.alertMessage.next(message);
    this.alertVisible.next(true);
  }

  /** 모든 modal을 닫는다. */
  closeAllDialog(): void {
    this.dialogService.dialogComponentRefMap.forEach(dialog => {
      dialog.destroy();
    });
  }

}
