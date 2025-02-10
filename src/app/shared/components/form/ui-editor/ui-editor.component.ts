import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorInitEvent, EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  selector: 'ui-editor',
  templateUrl: './ui-editor.component.html',
  styleUrl: './ui-editor.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiEditorComponent extends FormFieldComponent {

  /** 에디터 height */
  @Input() height = '320px';

  /** init 이벤트 */
  @Output() init? = new EventEmitter<EditorInitEvent>();

  /** change 이벤트 */
  @Output() textChange? = new EventEmitter<EditorTextChangeEvent>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** 에디터가 로드될 때 발생한다. */
  protected onInit(event: EditorInitEvent): void {
    this.init.emit(event);
  }

  /** 에디터의 값을 변경한다. */
  protected onTextChange(event: EditorTextChangeEvent): void {
    /**
     * 2025.01.28. 유효성검사가 제대로 동작 안하는 이슈로 인한 setTimeout을 추가
     * 예) 에디터에 값을 입력하고서 전부 지우면 오류메시지가 출력되지 않음
     */
    setTimeout(() => {
      this.setErrorMessage();
      this.textChange.emit(event);
    }, 0);
  }

}
