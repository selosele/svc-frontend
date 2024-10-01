import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UiAccordionComponent, UiButtonComponent } from '../../ui';
import { AccordionTab, UiAccordionChangeEvent } from '@app/shared/components/ui/ui-accordion/ui-accordion.model';
import { NotificationService } from '@app/notification/notification.service';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiAccordionComponent,
  ],
  selector: 'layout-notification',
  templateUrl: './layout-notification.component.html',
  styleUrl: './layout-notification.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutNotificationComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
  ) {}

  /** 알림 개수 */
  notificationCount: number;

  /** 알림 HTML 타이틀 */
  notificationHtmlTitle: string;

  /** 알림 표출 상태 */
  isListVisible = false;

  /** 알림 탭 목록 */
  tabs: AccordionTab[];

  ngOnInit() {
    this.notificationService.listNotification$()
    .subscribe((data) => {
      this.tabs = data.list.map(x => ({ title: x.notificationTitle, content: x.notiticationContent, key: x.notificationId }));
      this.notificationHtmlTitle = `${data.total}개의 읽지 않은 알림`;
      this.notificationCount = data.total;
    });
  }

  /** 알림 목록을 표출한다. */
  showNotificationList(): void {
    this.isListVisible = !this.isListVisible;
  }

  /** 알림 탭을 클릭한다. */
  onChange(event: UiAccordionChangeEvent) {
    const notificationId = event.activeKey as number;
    this.notificationService.updateNotificationReadDt$({ notificationId })
    .subscribe((data) => {

    });
  }

}
