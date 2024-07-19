import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCard
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
