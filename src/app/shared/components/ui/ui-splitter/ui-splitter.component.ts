import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SplitterModule } from 'primeng/splitter';
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
export class UiSplitterComponent {

  private splitterActiveSubject = new BehaviorSubject<boolean>(false);

  /** splitter 활성화 여부 */
  isSplitterActive$ = this.splitterActiveSubject.asObservable();

  /** splitter 스타일 */
  style = {
    // height: '500px',
    border: '0',
    background: 'inherit',
    color: 'inherit',
  };

  /** splitter를 활성화한다. */
  show(): void {
    this.splitterActiveSubject.next(true);
  }

  /** splitter를 비활성화한다. */
  hide(): void {
    this.splitterActiveSubject.next(false);
  }

  /** 닫기 버튼을 클릭해서 splitter를 비활성화한다. */
  onClose(event: Event): void {
    this.hide();
  }

}
