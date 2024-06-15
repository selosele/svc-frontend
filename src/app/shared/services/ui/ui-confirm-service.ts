import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UiConfirmService {

  constructor(
    private confirmationService: ConfirmationService,
  ) {}

  /** confirm 창(유형 1)을 표출한다. */
  confirm1(event: Event, message: string, onAccept: () => void, onReject?: () => void) {
    return this.confirmationService.confirm({
      target: event.target as EventTarget,
      message,
      header: '알림',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: onAccept,
      reject: onReject || (() => {}),
    });
  }

  /** confirm 창(유형 2)을 표출한다. */
  confirm2(event: Event, message: string, onAccept: () => void, onReject?: () => void) {
    return this.confirmationService.confirm({
      target: event.target as EventTarget,
      message,
      header: '알림',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: onAccept,
      reject: onReject || (() => {}),
    });
  }

}
