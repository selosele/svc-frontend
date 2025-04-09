import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
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
export class UiSplitterComponent implements AfterViewInit {

  /** 가로/세로 */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

  /** 세로 레이아웃 fix 여부 */
  @Input() verticalFix = false;

  /** splitter 활성화 여부 */
  private splitterActiveSubject = new BehaviorSubject<boolean>(false);
  isSplitterActive$ = this.splitterActiveSubject.asObservable();

  /** splitter 스타일 */
  style = {
    // height: '500px',
    border: '0',
    background: 'inherit',
    color: 'inherit',
  };

  ngAfterViewInit() {
    this.changeSplitterLayout();
  }

  /** splitter를 활성화한다. */
  show(): void {
    this.splitterActiveSubject.next(true);
  }

  /** splitter를 비활성화한다. */
  hide(): void {
    this.splitterActiveSubject.next(false);
  }

  /** 닫기 버튼을 클릭해서 splitter를 비활성화한다. */
  protected onClose(event: Event): void {
    this.hide();
  }

  /** splitter 레이아웃을 변경한다. */
  protected changeSplitterLayout(): void {
    if (this.verticalFix) return;

    if (window.innerWidth <= 1200) {
      this.layout !== 'vertical' ? this.layout = 'vertical' : '';
    } else {
      this.layout !== 'horizontal' ? this.layout = 'horizontal' : '';
    }
  }

  /** 모바일에서 세로형으로 변경한다. */
  @HostListener('window:resize', ['$event'])
  protected onWindowResize(event: Event): void {
    this.changeSplitterLayout();
  }

}
