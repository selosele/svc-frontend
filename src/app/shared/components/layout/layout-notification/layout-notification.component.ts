import { Component, ElementRef, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../ui';
import { NotificationStore } from '@app/notification/notification.store';
import { NotificationService } from '@app/notification/notification.service';
import { NotificationResultDTO } from '@app/notification/notification.model';
import { dateUtil } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
  ],
  selector: 'layout-notification',
  templateUrl: './layout-notification.component.html',
  styleUrl: './layout-notification.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutNotificationComponent implements OnInit {

  constructor(
    private notificationStore: NotificationStore,
    private notificationService: NotificationService,
    private eRef: ElementRef,
  ) {}

  /** 알림 개수 */
  get notificationTotal() {
    return this.notificationStore.select<number>('notificationTotal').value;
  }

  /** 알림 목록 */
  get notificationList() {
    return this.notificationStore.select<NotificationResultDTO[]>('notificationList').value;
  }

  /** 알림 HTML 타이틀 */
  get notificationHtmlTitle() {
    return this.notificationStore.select<string>('notificationHtmlTitle').value;
  }

  /** 알림 표출 상태 */
  get isNotificationLayerVisible() {
    return this.notificationStore.select<string>('isNotificationLayerVisible').value;
  }

  ngOnInit() {
    this.listNotification();
  }

  /** 알림 개수 및 목록을 조회한다. */
  listNotification(): void {
    this.notificationService.listNotification();
  }

  /** 알림 목록을 표출한다. */
  toggleNotificationList(): void {
    this.notificationStore.update('isNotificationLayerVisible', !this.isNotificationLayerVisible);
  }

  /** 알림을 확인처리한다. */
  updateNotificationReadDt(notificationId: number): void {
    this.notificationService.updateNotificationReadDt$({ notificationId })
    .subscribe(() => {
      this.listNotification();
    });
  }

  /** 알림을 삭제한다. */
  removeNotification(notificationId: number): void {
    this.notificationService.removeNotification$(notificationId)
    .subscribe(() => {
      this.listNotification();
    });
  }

  /** 알림 등록일시를 반환한다. */
  getCreateDt(value: string): string {
    const createDt = dateUtil(value);

    // 하루가 안지났으면 시간단위로 반환
    if (!dateUtil().isAfter(createDt, 'day')) {
      return createDt.format('HH:mm:ss');  
    }
    return createDt.format('YYYY.MM.DD.');
  }

  /** 알림창 바깥 화면을 클릭해서 알림창을 닫는다. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // 클릭된 요소가 알림창 내부에 있는지 확인
    if (this.isNotificationLayerVisible && !this.eRef.nativeElement.contains(event.target)) {
      this.notificationStore.update('isNotificationLayerVisible', false);
    }
  }

  /** Esc 키를 클릭해서 알림창을 닫는다. */
  @HostListener('document:keyup.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isNotificationLayerVisible) {
      this.notificationStore.update('isNotificationLayerVisible', false);
    }
  }

}
