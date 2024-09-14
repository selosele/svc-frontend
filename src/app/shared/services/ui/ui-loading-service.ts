import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';

@Injectable({ providedIn: 'root' })
export class UiLoadingService {

  constructor(
    private store: StoreService,
  ) {}

  private loading = this.store.createState<boolean>('loading', false);
  loading$ = this.loading.asObservable();

  /** 로딩 실행 중 여부를 반환한다. */
  isLoading(): boolean {
    return this.loading?.value;
  }

  /** 로딩 상태를 설정한다. */
  setLoading(loading: boolean): void {

    /**
     * setTimeout을 추가해서 ExpressionChangedAfterItHasBeenCheckedError 방지
     * modal 표출 후 HTTP 요청을 전송할 때 발생하는 오류
     */
    setTimeout(() => {
      this.loading.next(loading);
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
