import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any) {
  }
}
