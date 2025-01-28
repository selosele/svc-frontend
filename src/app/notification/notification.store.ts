import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';
import { NotificationResultDTO } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'notificationList', defaultValue: [] as NotificationResultDTO[] }, // 알림 목록
      { key: 'notificationCount', defaultValue: null as number },               // 알림 개수
      { key: 'notificationHtmlTitle', defaultValue: null as string },           // 알림 HTML 타이틀
      { key: 'isNotificationLayerVisible', defaultValue: false },               // 알림창 표출 상태
    ]);
  }

}