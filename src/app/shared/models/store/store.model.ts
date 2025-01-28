import { BehaviorSubject } from 'rxjs';

/** 상태 저장 공간의 타입 */
export type StoreMap<T = any> = Map<string,
  {
    subject: BehaviorSubject<T>;
    initialValue?: T;
  }
>;
