import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutPageDescriptionComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components';
import { CodeService } from '../../code/code.service';
import { CodeResponseDTO } from '../../code/code.model';
import { SystemCodeDetailComponent } from './system-code-detail/system-code-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTableComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
    SystemCodeDetailComponent,
  ],
  selector: 'view-system-code',
  templateUrl: './system-code.component.html',
  styleUrl: './system-code.component.scss'
})
export class SystemCodeComponent implements OnInit {

  constructor(
    private codeService: CodeService,
  ) {}

  /** table */
  @ViewChild('table') table: UiTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 코드 목록 */
  get codeList(): CodeResponseDTO[] {
    return this.codeService.codeListSubject.value;
  }

  /** 코드 목록 데이터 로드 완료 여부 */
  get codeListDataLoad(): boolean {
    return this.codeService.codeListDataLoadSubject.value;
  }

  /** 코드 상세 정보 */
  codeDetail: CodeResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: CodeResponseDTO;

  /** 행 스타일 */
  getRowStyle = (params) => {
    const { codeDepth } = params.data;
    if (codeDepth > 1) {
      return {
        backgroundColor: '#fcfbfb',
      };
    }
    return null;
  };

  /** 테이블 컬럼 목록 */
  cols = [
    { field: 'codeId',      header: '코드 ID', flex: 1,
      cellStyle: (params) => {
        const { codeDepth } = params.data;
        const indent = 16;

        if (codeDepth > 1) {
          return {
            paddingLeft: ((codeDepth + 1) * indent) + 'px',
          }
        }
        return null;
      }
    },
    { field: 'upCodeId',    header: '상위 코드 ID' },
    { field: 'codeValue',   header: '코드 값' },
    { field: 'codeName',    header: '코드 명' },
    { field: 'codeContent', header: '코드 내용' },
    { field: 'codeOrder',   header: '코드 순서' },
    { field: 'useYn',       header: '사용 여부' },
  ];

  ngOnInit(): void {
    if (!this.codeListDataLoad) {
      this.listCode();
    }
  }

  /** 코드 목록을 조회한다. */
  listCode(): void {
    this.codeService.listCode();
  }

  /** 테이블 행을 선택한다. */
  onRowSelect(event: any) {
    this.codeService.getCode(event.data['codeId'])
    .subscribe((data) => {
      this.codeDetail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any) {
    this.codeDetail = {};
    this.splitter.hide();
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listCode();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listCode();
  }
  
  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
