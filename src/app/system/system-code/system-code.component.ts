import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CoreBaseComponent } from '@app/shared/components/core';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTreeTableComponent } from '@app/shared/components/ui';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { CodeStore } from '@app/code/code.store';
import { CodeService } from '../../code/code.service';
import { CodeResultDTO, CodeTree } from '../../code/code.model';
import { SystemCodeDetailComponent } from './system-code-detail/system-code-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiTreeTableComponent,
    UiSplitterComponent,
    UiButtonComponent,
    LayoutPageDescriptionComponent,
    SystemCodeDetailComponent,
  ],
  selector: 'view-system-code',
  templateUrl: './system-code.component.html',
  styleUrl: './system-code.component.scss'
})
export class SystemCodeComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private codeStore: CodeStore,
    private codeService: CodeService,
  ) {
    super();
  }

  /** tree table */
  @ViewChild('treeTable') treeTable: UiTreeTableComponent;

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 코드 트리 목록 */
  get codeTree(): CodeTree[] {
    return this.codeStore.select<CodeTree[]>('codeTree').value;
  }

  /** 코드 목록 데이터 로드 완료 여부 */
  get codeListDataLoad() {
    return this.codeStore.select<boolean>('codeListDataLoad').value;
  }

  /** 코드 정보 */
  detail: CodeResultDTO = null;

  /** 테이블 선택된 행 */
  selection: TreeNode;

  /** 테이블 컬럼 */
  cols = [
    { field: 'codeId',    header: '코드 ID' },
    { field: 'codeValue', header: '코드 값' },
    { field: 'codeName',  header: '코드명' },
    { field: 'codeOrder', header: '코드 순서' },
    { field: 'useYn',     header: '사용 여부' },
  ];

  ngOnInit() {
    if (!this.codeListDataLoad && this.user) {
      this.listCode();
    }
  }

  /** 코드 목록을 조회한다. */
  listCode(): void {
    this.codeService.listCode$().subscribe((response) => {

    });
  }

  /** 코드를 추가한다. */
  addCode(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 테이블 행을 선택한다. */
  onNodeSelect(event: any) {
    this.codeService.getCode$(event.node.data['codeId'])
    .subscribe((response) => {
      this.detail = response.code;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onNodeUnselect(event: any) {
    this.detail = {};
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
