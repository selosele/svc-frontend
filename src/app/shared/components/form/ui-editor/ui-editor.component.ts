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

  /** 에디터 init 이벤트 */
  @Output() init? = new EventEmitter<EditorInitEvent>();

  /** 에디터 change 이벤트 */
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
    this.setErrorMessage();
    this.textChange.emit(event);
  }

}
