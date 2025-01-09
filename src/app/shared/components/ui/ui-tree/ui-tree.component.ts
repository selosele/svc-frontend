import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeModule, TreeNodeCollapseEvent, TreeNodeExpandEvent, TreeNodeSelectEvent, TreeNodeUnSelectEvent } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { UiTreeButtonsComponent } from '../ui-tree-buttons/ui-tree-buttons.component';

@Component({
  standalone: true,
  imports: [
    TreeModule,
    UiTreeButtonsComponent,
  ],
  selector: 'ui-tree',
  templateUrl: './ui-tree.component.html',
  styleUrl: './ui-tree.component.scss'
})
export class UiTreeComponent {

  /** tree 데이터 */
  @Input() data: TreeNode[] = [];

  /** tree 데이터 */
  @Input() selectionMode?: 'single' | 'multiple' | 'checkbox' = 'single';

  /** tree 선택된 노드 */
  @Input() selectedNode?: TreeNode;

  /** tree 새로고침 버튼 사용여부 */
  @Input() useRefresh = true;

  /** tree 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** tree 노드 선택 이벤트 */
  @Output() nodeSelect = new EventEmitter<TreeNodeSelectEvent>();

  /** tree 노드 선택해제 이벤트 */
  @Output() nodeUnselect = new EventEmitter<TreeNodeUnSelectEvent>();

  /** tree 노드 확장 이벤트 */
  @Output() nodeExpand = new EventEmitter<TreeNodeExpandEvent>();

  /** tree 노드 확장해제 이벤트 */
  @Output() nodeCollapse = new EventEmitter<TreeNodeCollapseEvent>();

  /** tree 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

  /** tree 노드를 선택한다. */
  protected onNodeSelect(event: TreeNodeSelectEvent): void {
    this.nodeSelect.emit(event);
  }

  /** tree 노드를 선택해제한다. */
  protected onNodeUnselect(event: TreeNodeUnSelectEvent): void {
    this.nodeUnselect.emit(event);
  }

  /** tree 노드를 확장한다. */
  protected onNodeExpand(event: TreeNodeExpandEvent): void {
    this.nodeExpand.emit(event);
  }

  /** tree 노드를 확장해제한다. */
  protected onNodeCollapse(event: TreeNodeCollapseEvent): void {
    this.nodeCollapse.emit(event);
  }

}
