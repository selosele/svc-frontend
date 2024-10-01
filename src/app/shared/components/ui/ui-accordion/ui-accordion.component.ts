import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { AccordionTab, UiAccordionChangeEvent } from './ui-accordion.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
  ],
  selector: 'ui-accordion',
  templateUrl: './ui-accordion.component.html',
  styleUrl: './ui-accordion.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiAccordionComponent {

  /** 아코디언 탭 목록 */
  @Input() tabs: AccordionTab[] = [];

  /** 활성화된 탭 index */
  @Input() activeIndex: number;

  /** 아코디언 탭 index 변경 이벤트 */
  @Output() activeIndexChange = new EventEmitter<UiAccordionChangeEvent>();

  /** 아코디언 탭을 클릭하여 탭 index를 변경한다. */
  onActiveIndexChange(index: number | number[]) {
    this.activeIndexChange.emit({ index, activeKey: this.tabs[index as number]?.key } as UiAccordionChangeEvent);
  }

}
