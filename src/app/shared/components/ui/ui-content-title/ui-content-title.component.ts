import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  selector: 'ui-content-title',
  templateUrl: './ui-content-title.component.html',
  styleUrl: './ui-content-title.component.scss',
})
export class UiContentTitleComponent {

  /** 콘텐츠 타이틀 내용 */
  @Input() text?: string;

}
