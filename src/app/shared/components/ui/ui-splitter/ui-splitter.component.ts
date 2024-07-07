import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { UiSplitterService } from '@app/shared/services';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SplitterModule,
    UiButtonComponent,
  ],
  selector: 'ui-splitter',
  templateUrl: './ui-splitter.component.html',
  styleUrl: './ui-splitter.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiSplitterComponent implements OnInit {

  constructor(
    private splitterService: UiSplitterService,
  ) {}

  /** Splitter 활성화 여부 */
  isSplitterActive = false;

  /** Splitter 스타일 */
  style = {
    height: '500px',
    border: '0',
    background: 'inherit',
    color: 'inherit',
  };

  ngOnInit(): void {
    this.splitterService.isSplitterActive$.subscribe((isSplitterActive) => {
      this.isSplitterActive = isSplitterActive;
    });
  }

  /** 버튼을 클릭해서 Splitter를 비활성화한다. */
  onClose(event: Event): void {
    this.splitterService.hideSplitter();
  }

}
