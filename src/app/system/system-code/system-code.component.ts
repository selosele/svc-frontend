import { Component, OnInit, ViewChild } from '@angular/core';
import { GridApi, CellClickedEvent } from '@ag-grid-community/core';
import { LayoutPageDescriptionComponent, UiDataGridComponent, UiSkeletonComponent, UiSplitterComponent } from '@app/shared/components';
import { CodeService } from '../../code/code.service';
import { CodeResponseDTO } from '../../code/code.model';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiDataGridComponent,
    UiSplitterComponent,
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-system-code',
  templateUrl: './system-code.component.html',
  styleUrl: './system-code.component.scss'
})
export class SystemCodeComponent implements OnInit {

  constructor(
    private codeService: CodeService,
  ) {}

  /** grid */
  @ViewChild('grid') grid: UiDataGridComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 코드 목록 */
  get codeList() {
    return this.codeService.codeListSubject.value;
  }

  /** 코드 목록 데이터 로드 완료 여부 */
  get codeListDataLoad() {
    return this.codeService.codeListDataLoadSubject.value;
  }

  /** 코드 상세 정보 */
  codeDetail: CodeResponseDTO = null;

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

  columnDefs = [
    { field: 'codeId',      headerName: '코드 ID', flex: 1,
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
    { field: 'upCodeId',    headerName: '상위 코드 ID', flex: 1 },
    { field: 'codeValue',   headerName: '코드 값', flex: 1 },
    { field: 'codeName',    headerName: '코드 명', flex: 1 },
    { field: 'codeContent', headerName: '코드 내용', flex: 1 },
    { field: 'codeOrder',   headerName: '코드 순서', width: 100 },
    { field: 'useYn',       headerName: '사용 여부', width: 100 },
  ];

  ngOnInit(): void {
    if (this.codeList.length === 0) {
      this.listCode();
    }
  }

  onGridReady(gridApi: GridApi): void {
    
  }

  onCellClicked(event: CellClickedEvent): void {
    this.codeService.getCode(event.data['codeId'])
    .subscribe((data) => {
      this.codeDetail = data;
      this.splitter.show();
    });
  }

  /** 코드 목록을 조회한다. */
  listCode(): void {
    this.codeService.listCode();
  }

  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listCode();
  }

}
