import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
  ],
  selector: 'ui-alert',
  templateUrl: './ui-alert.component.html',
  styleUrl: './ui-alert.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiAlertComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
  ) {}

  /** alert 표출 상태 */
  visible = false;

  /** alert 메시지 */
  get message(): string {
    return this.config?.data?.['message'];
  }

  /** modal type */
  get type(): string {
    return this.config?.data?.['type'];
  }

  ngOnInit(): void {
    if (this.type === 'alert') {
      this.visible = true;
    }
  }

  /** alert을 닫는다. */
  closeAlert(event: Event): void {
    this.visible = false;
    this.dialogRef.close();
  }

}
