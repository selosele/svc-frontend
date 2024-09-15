import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreService {

  /** 상태 저장 공간 */
  private store: Map<string, { subject: BehaviorSubject<any>, initialValue: any }> = new Map();

  /** 상태를 생성해서 반환한다(상태가 존재하면 기존 상태를 반환). */
  create<T>(key: string, defaultValue: T): BehaviorSubject<T> {
    if (this.store.has(key)) {
      return this.store.get(key).subject;
    }
    const subject = new BehaviorSubject<T>(defaultValue);
    this.store.set(key, { subject, initialValue: defaultValue });
    return subject;
  }

  /** 상태를 반환한다. */
  select<T>(key: string): BehaviorSubject<T> {
    return this.store.get(key).subject as BehaviorSubject<T>;
  }

  /** 모든 상태를 초기 값으로 초기화한다. */
  resetAll(): void {
    this.store.forEach((value, key) => {
      value.subject.next(value.initialValue);
    });
  }

  /** 모든 상태를 삭제한다. */
  clearAll(): void {
    this.store.clear();
  }

}
