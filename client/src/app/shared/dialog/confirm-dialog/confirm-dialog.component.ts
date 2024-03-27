import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogClose
  ],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) protected operation:string) {
  }
}
