import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  imports: [
    ConfirmDialogModule,
  ],
  selector: 'ui-confirm',
  templateUrl: './ui-confirm.component.html',
  styleUrl: './ui-confirm.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiConfirmComponent {

  

}
