import { Component, ViewEncapsulation } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { DialogModule } from 'primeng/dialog';
import { UiDialogService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    DialogModule,
    UiButtonComponent,
  ],
  selector: 'ui-alert',
  templateUrl: './ui-alert.component.html',
  styleUrl: './ui-alert.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiAlertComponent {

  constructor(
    private dialogService: UiDialogService,
  ) {}

  /** alert 메시지 */
  get message(): string {
    return this.dialogService.alertMessage.value;
  }

  /** alert 표출 상태 */
  get visible(): boolean {
    return this.dialogService.alertVisible.value;
  }

  /** alert을 닫는다. */
  closeAlert(event: Event): void {
    this.dialogService.alertMessage.next('');
    this.dialogService.alertVisible.next(false);
  }

}
