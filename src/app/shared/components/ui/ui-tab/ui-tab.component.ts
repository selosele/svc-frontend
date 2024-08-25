import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { Tab, UiTabChangeEvent } from '@app/shared/models';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
  ],
  selector: 'ui-tab',
  templateUrl: './ui-tab.component.html',
  styleUrl: './ui-tab.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTabComponent {

  /** 탭 구조 */
  @Input() tabs: Tab[];

  /** 클릭된 탭의 index */
  @Input() activeIndex?: number;

  /** 탭 클릭 이벤트 */
  @Output() change = new EventEmitter<UiTabChangeEvent>();

  /** 탭을 클릭한다. */
  onChange(event: TabViewChangeEvent): void {
    this.change.emit({ ...event, activeKey: this.tabs[event.index]?.key });
  }

}
