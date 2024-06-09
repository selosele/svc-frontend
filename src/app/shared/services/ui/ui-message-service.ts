import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UiMessageService {

  constructor(
    private messageService: MessageService,
  ) {}

  /** 성공 메시지를 표출한다. */
  success(detail: string, summary?: 'Success'): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  /** 정보 메시지를 표출한다. */
  info(detail: string, summary?: 'Info'): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  /** 경고 메시지를 표출한다. */
  warn(detail: string, summary?: 'Warn'): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  /** 오류 메시지를 표출한다. */
  error(detail: string, summary?: 'Error'): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }

}
