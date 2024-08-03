import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {

  /** 상태 저장 공간 */
  private store = new Map<string, BehaviorSubject<any>>();

  /** 상태를 생성해서 반환한다. */
  createState<T>(key: string, defaultValue: T): BehaviorSubject<T> {
    if (this.store.has(key)) {
      throw new Error(`State with key "${key}" already exists.`);
    }
    const subject = new BehaviorSubject<T>(defaultValue);
    this.store.set(key, subject);
    return subject;
  }

  /** 상태를 반환한다. */
  getState<T>(key: string): BehaviorSubject<T> | undefined {
    return this.store.get(key) as BehaviorSubject<T> | undefined;
  }

  /** 모든 상태를 삭제한다. */
  clearAllState(): void {
    this.store.clear();
  }

}
