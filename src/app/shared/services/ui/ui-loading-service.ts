import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiLoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  /** 로딩 실행 중 여부를 반환한다. */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /** 로딩 상태를 설정한다. */
  setLoading(loading: boolean): void {

    // setTimeout을 추가해서 ExpressionChangedAfterItHasBeenCheckedError 방지
    // modal 표출 후 http 요청을 전송할 때 발생하는 오류
    setTimeout(() => {
      this.loadingSubject.next(loading);
    }, 0);
  }

  /** 로딩을 종료한다. */
  stopLoading(): void {
    if (this.isLoading()) {
      this.setLoading(false);
      window.stop();
    }
  }

}
