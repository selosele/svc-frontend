import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UiButtonComponent } from '../../ui';
import { NotificationService } from '@app/notification/notification.service';
import { NotificationResultDTO } from '@app/notification/notification.model';
import { StoreService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
  ],
  selector: 'layout-notification',
  templateUrl: './layout-notification.component.html',
  styleUrl: './layout-notification.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutNotificationComponent implements OnInit {

  constructor(
    private store: StoreService,
    private notificationService: NotificationService,
  ) {}

  /** 알림 개수 */
  get notificationCount() {
    return this.store.select<number>('notificationCount').value;
  }

  /** 알림 목록 */
  get notificationList() {
    return this.store.select<NotificationResultDTO[]>('notificationList').value;
  }

  /** 알림 HTML 타이틀 */
  get notificationHtmlTitle() {
    return this.store.select<string>('notificationHtmlTitle').value;
  }

  /** 알림 표출 상태 */
  isListVisible = false;

  ngOnInit() {
    this.listNotification();
  }

  /** 알림 개수 및 목록을 조회한다. */
  listNotification(): void {
    this.notificationService.listNotification();
  }

  /** 알림 목록을 표출한다. */
  showNotificationList(): void {
    this.isListVisible = !this.isListVisible;
  }

  /** 알림을 확인처리한다. */
  updateNotificationReadDt(notificationId: number) {
    this.notificationService.updateNotificationReadDt$({ notificationId })
    .subscribe(() => {
      this.listNotification();
    });
  }

  /** 알림을 삭제한다. */
  removeNotification(notificationId: number) {
    this.notificationService.removeNotification$(notificationId)
    .subscribe(() => {
      this.listNotification();
    });
  }

}
