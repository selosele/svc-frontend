/** HTTP 요청 DTO의 기본 클래스 */
export class HttpRequestDTOBase {

  /** 사용 여부 */
  useYn?: string = 'Y';

  /** 삭제 여부 */
  deleteYn?: string = 'N';

  /** 등록자 ID */
  createrId?: number;
  
  /** 수정자 ID */
  updaterId?: number;

}
