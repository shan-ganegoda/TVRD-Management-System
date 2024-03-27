import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-notfoundpage',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './notfoundpage.component.html',
  styleUrl: './notfoundpage.component.scss'
})
export class NotfoundpageComponent {

  constructor(private router:Router) {
  }

  navigateToMainPage() {
    this.router.navigate(['/main/home']);
  }
}
