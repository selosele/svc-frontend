/** 아코디언 탭 */
export interface AccordionTab {

  /** 아코디언 탭명 */
  title: string;

  /** 아코디언 탭 내용 */
  content?: any;

  /** 아코디언 탭 key */
  key?: any;
  
}

/** 아코디언 탭 클릭 이벤트 */
export class UiAccordionChangeEvent {

  /** 선택된 탭의 index */
  index: number;

  /** 선택된 탭의 key */
  activeKey: any;

}
