import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiLoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  /** 로딩 상태를 반환한다. */
  getLoading(): boolean {
    return this.loadingSubject.value;
  }

  /** 로딩 상태를 설정한다. */
  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  /** 로딩을 종료한다. */
  stopLoading(): void {
    if (this.getLoading()) {
      this.setLoading(false);
      window.stop();
    }
  }

}
