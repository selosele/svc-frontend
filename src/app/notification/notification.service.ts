import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '@app/shared/services';
import { NotificationResponseDTO, NotificationResultDTO, SaveNotificationRequestDTO } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) {}

  /** 알림 목록 */
  private notificationList = this.store.create<NotificationResultDTO[]>('notificationList', null);

  /** 알림 개수 */
  private notificationCount = this.store.create<number>('notificationCount', null);

  /** 알림 HTML 타이틀 */
  private notificationHtmlTitle = this.store.create<string>('notificationHtmlTitle', null);

  /** 알림창 표출 상태 */
  private isNotificationLayerVisible = this.store.create<boolean>('isNotificationLayerVisible', false);

  /** 알림 개수 및 목록을 조회한다. */
  listNotification(): void {
    this.http.get<NotificationResponseDTO>('/co/notifications')
    .subscribe((data) => {
      this.store.update('notificationList', data.list);
      this.store.update('notificationCount', data.total);
      this.store.update('notificationHtmlTitle', `${data.total}개의 읽지 않은 알림`);
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
