import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {VehicleStatus} from "../../core/entity/vehiclestatus";
import {VehicleType} from "../../core/entity/vehicletype";
import {Moh} from "../../core/entity/moh";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {Vehicle} from "../../core/entity/vehicle";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {VehicleService} from "../../core/service/vehicle/vehicle.service";
import {MohService} from "../../core/service/moh/moh.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VehiclestatusService} from "../../core/service/vehicle/vehiclestatus.service";
import {VehicletypeService} from "../../core/service/vehicle/vehicletype.service";
import {VehiclemodelService} from "../../core/service/vehicle/vehiclemodel.service";

class VehicleModel {
}

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatGridList,
    MatGridTile,
    AsyncPipe,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  vehicleSearchForm!:FormGroup;

  vehiclestatuses: VehicleStatus[] = [];
  vehiclemodels: VehicleModel[] = [];
  vehicletypes: VehicleType[] = [];
  mohs: Moh[] = [];
  vehicles: Vehicle[] = [];

  regexes:any;

  dataSource!: MatTableDataSource<Vehicle>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  constructor(
              private vs : VehicleService,
              private ms : MohService,
              private rs:RegexService,
              private dialog:MatDialog,
              private snackBar:MatSnackBar,
              private cdr:ChangeDetectorRef,
              private vss : VehiclestatusService,
              private vts : VehicletypeService,
              private vms : VehiclemodelService,
              private fb : FormBuilder
  ) {

    this.vehicleSearchForm = this.fb.group({
      ssnumber:[null,[Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      ssstatus:[''],
      sstype:[''],
      ssmoh:[''],
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.vss.getAll().subscribe({
      next:data => this.vehiclestatuses = data,
    });

    this.vts.getAll().subscribe({
      next:data => this.vehicletypes = data,
    });

    this.vms.getAll().subscribe({
      next:data => this.vehiclemodels = data,
    });

    this.ms.getAllMohsList().subscribe({
      next:data => this.mohs = data
    });

    this.rs.getRegexes('vehicle').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.vs.getAll(query).subscribe({
      next:data =>{
        this.vehicles = data;
        this.dataSource = new MatTableDataSource(this.vehicles);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){}

  handleSearch() {

  }

  clearSearch() {

  }

  fillForm(vehicle: any) {

  }
}
