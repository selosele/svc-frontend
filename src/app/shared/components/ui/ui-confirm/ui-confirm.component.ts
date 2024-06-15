import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  imports: [
    ConfirmDialogModule,
  ],
  selector: 'ui-confirm',
  templateUrl: './ui-confirm.component.html',
  styleUrl: './ui-confirm.component.scss'
})
export class UiConfirmComponent {

  

}
