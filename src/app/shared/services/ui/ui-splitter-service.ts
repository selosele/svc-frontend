import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiSplitterService {

  private splitterActiveSubject = new BehaviorSubject<boolean>(false);

  /** Splitter 활성화 여부 */
  isSplitterActive$ = this.splitterActiveSubject.asObservable();

  /** Splitter를 활성화한다. */
  showSplitter(): void {
    this.splitterActiveSubject.next(true);
  }

  /** Splitter를 비활성화한다. */
  hideSplitter(): void {
    this.splitterActiveSubject.next(false);
  }

}
