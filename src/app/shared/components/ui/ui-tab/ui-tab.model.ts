import { TabViewChangeEvent } from 'primeng/tabview';

/** 탭 */
export interface Tab {

  /** 탭명 */
  title: string;

  /** 탭 내용 */
  content?: any;

  /** 탭 key */
  key?: any;

  /** 탭 데이터 로드 완료 여부 */
  dataLoad?: boolean;
  
}

/** 탭 클릭 이벤트 */
export class UiTabChangeEvent implements TabViewChangeEvent {

  /** 탭 클릭 이벤트 */
  originalEvent: Event;

  /** 선택된 탭의 index */
  index: number;

  /** 선택된 탭의 key */
  activeKey: any;

}
