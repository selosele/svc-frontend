import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { Tab, UiTabChangeEvent } from './ui-tab.model';

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

  /** 탭 목록 */
  @Input() tabs: Tab[];

  /** 클릭된 탭의 index */
  @Input() activeIndex?: number;

  /** 탭 클릭 이벤트 */
  @Output() change = new EventEmitter<UiTabChangeEvent>();

  /** 선택된 탭 index 변경 이벤트 */
  @Output() activeIndexChange = new EventEmitter<number>();

  /** 탭을 클릭한다. */
  onChange(event: TabViewChangeEvent): void {
    this.change.emit({ ...event, activeKey: this.tabs[event.index]?.key });
  }

  /** 탭을 클릭하여 탭 index를 변경한다. */
  onActiveIndexChange(index: number): void {
    this.activeIndexChange.emit(index);
  }

}
