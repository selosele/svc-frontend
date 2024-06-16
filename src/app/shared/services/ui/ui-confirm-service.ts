import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UiConfirmService {

  constructor(
    private confirmationService: ConfirmationService,
  ) {}

  /** confirm 창(유형 1)을 표출한다. */
  async confirm1(event: Event, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message,
        header: '알림',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  /** confirm 창(유형 2)을 표출한다. */
  async confirm2(event: Event, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message,
        header: '알림',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        acceptIcon: 'none',
        rejectIcon: 'none',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

}
