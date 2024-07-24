import { Component } from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
    imports: [
        MatDialogClose
    ],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss'
})
export class LogoutDialogComponent {

}
