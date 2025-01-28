import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreMap } from '@app/shared/models';

@Injectable({ providedIn: 'root' })
export class StoreService {

  constructor() {
    this.init();
  }

  /** 상태 저장 공간 */
  private store: StoreMap = new Map();

  /** 특정 로직을 최초 실행한다. */
  init() {

  }

  /** 상태를 생성해서 반환한다(상태가 존재하면 기존 상태를 반환). */
  create<T>(key: string, defaultValue: T): BehaviorSubject<T> {
    if (this.store.has(key)) {
      return this.select(key);
    }
    const subject = new BehaviorSubject<T>(defaultValue);
    this.store.set(key, { subject, initialValue: defaultValue });
    return subject;
  }

  /** 여러 개의 상태를 생성한다. */
  creates(states: { key: string; defaultValue: any }[]): void {
    states.forEach(({ key, defaultValue }) => {
      if (!this.store.has(key)) {
        const subject = new BehaviorSubject(defaultValue);
        this.store.set(key, { subject, initialValue: defaultValue });
      }
    });
  }

  /** 상태를 반환한다. */
  select<T>(key: string): BehaviorSubject<T> {
    return this.store.get(key).subject as BehaviorSubject<T>;
  }

  /** 상태를 변경한다. */
  update(key: string, value: any): void {
    this.select(key).next(value);
  }

  /** 모든 상태를 초기 값으로 초기화한다. */
  resetAll(): void {
    this.store.forEach((value, key) => {
      value.subject.next(value.initialValue);
    });
  }

  /** 모든 상태를 삭제한다. */
  deleteAll(): void {
    this.store.clear();
  }

}
