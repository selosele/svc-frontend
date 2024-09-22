import { BehaviorSubject } from 'rxjs';

/** 상태 저장 공간의 타입 */
export type StoreMap = Map<string, { subject: BehaviorSubject<any>, initialValue?: any }>;
