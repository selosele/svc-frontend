/** PDF 다운로드 옵션 */
export interface ExportPdfOptions {

  /** PDF 다운로드 영역의 HTML Element */
  element?: HTMLElement;

  /** PDF 다운로드 파일명 */
  fileName?: string;

  /** PDF 다운로드 시 제외할 HTML Element ID 배열 */
  ignoreElements?: string[];

  /** 가로/세로 방향 */
  orientation?: 'landscape' | 'portrait';

  /** PDF 다운로드 영역의 margin 값 */
  margin?: number;

}
