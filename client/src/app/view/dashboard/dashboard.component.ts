import {Component, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {MohService} from "../../core/service/moh/moh.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {MotherService} from "../../core/service/motherregistration/mother.service";

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

  employeecount:number =0;
  mothercount:number =0;
  cliniccount:number =0;
  mohcount:number =0;

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

  constructor(
              private es: EmployeeService,
              private ms:MohService,
              private cs:ClinicService,
              private mos:MotherService
  ) {
  }



  ngOnInit(){
    this.today = new Date();

    this.initialize();
  }

  initialize(){

this.ms.getAllMohsList().subscribe({
  next: data=> {
    this.mohcount = data.length;
  }
});

    this.cs.getAll("").subscribe({
      next: data=> {
        this.cliniccount = data.length;
      }
    });

    this.es.getAllEmployeesList("").subscribe({
      next: data=> {
        this.employeecount = data.length;
      }
    });

    this.mos.getAll("").subscribe({
      next: data=> {
        this.mothercount = data.length;
      }
    });

  }

}
