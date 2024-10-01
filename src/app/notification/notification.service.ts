import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationResponseDTO, UpdateNotificationRequestDTO } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 알림 개수 및 목록을 조회한다. */
  listNotification$() {
    return this.http.get<NotificationResponseDTO>('/common/notifications');
  }

  /** 알림을 확인처리한다. */
  updateNotificationReadDt$(dto: UpdateNotificationRequestDTO) {
    const { notificationId } = dto;
    return this.http.put<number>(`/common/notifications/${notificationId}`, dto);
  }

}
