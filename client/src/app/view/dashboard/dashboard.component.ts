import {Component, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatListItem,
    MatIcon,
    NgForOf,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  today:any;

  userspecmessages: any[] = [
    {name: 'support.tec@pdhs.lk', updated: new Date('5/30/23')},
    {name: 'it@pdhs.lk', updated: new Date('5/17/23')},
    {name: 'it.gov@pdhs.lk', updated: new Date('5/28/23')},
    {name: 'it@health.lk', updated: new Date('4/28/23')},
  ];

  generalmessages: any[] = [
    {name: 'hr@heath.lk', updated: new Date('5/30/23')},
    {name: 'admin@health.lk', updated: new Date('5/17/23')},
    {name: 'it@health.lk', updated: new Date('5/28/23')},
    {name: 'it@pdhs.lk', updated: new Date('4/28/23')}
  ];



  ngOnInit(){
    this.today = new Date();
  }

}
