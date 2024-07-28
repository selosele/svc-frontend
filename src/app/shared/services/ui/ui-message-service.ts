import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UiMessageService {

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  /** 성공 toast 메시지를 표출한다. */
  toastSuccess(detail: string, summary?: 'Success'): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  /** 정보 toast 메시지를 표출한다. */
  toastInfo(detail: string, summary?: 'Info'): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  /** 경고 toast 메시지를 표출한다. */
  toastWarn(detail: string, summary?: 'Warn'): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  /** 오류 toast 메시지를 표출한다. */
  toastError(detail: string, summary?: 'Error'): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  /** confirm 창(유형 1)을 표출한다. */
  confirm1(message: string, header = '알림'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message,
        header,
        icon: 'pi pi-info-circle', // pi-exclamation-triangle
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  /** confirm 창(유형 2)을 표출한다. */
  confirm2(message: string, header = '알림'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message,
        header,
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
