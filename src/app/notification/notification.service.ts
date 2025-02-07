import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationStore } from './notification.store';
import { NotificationResponseDTO, SaveNotificationRequestDTO } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private http: HttpClient,
    private notificationStore: NotificationStore,
  ) {}

  /** 알림 개수 및 목록을 조회한다. */
  listNotification(): void {
    this.http.get<NotificationResponseDTO>('/co/notifications')
    .subscribe((response) => {
      this.notificationStore.update('notificationList', response.list);
      this.notificationStore.update('notificationCount', response.total);
      this.notificationStore.update('notificationHtmlTitle', `${response.total}개의 읽지 않은 알림`);
    });
  }

  /** 알림을 확인처리한다. */
  updateNotificationReadDt$(dto: SaveNotificationRequestDTO) {
    const { notificationId } = dto;
    return this.http.put<void>(`/co/notifications/${notificationId}`, dto);
  }

  /** 알림을 삭제한다. */
  removeNotification$(notificationId: number) {
    return this.http.delete<void>(`/co/notifications/${notificationId}`);
  }

}
