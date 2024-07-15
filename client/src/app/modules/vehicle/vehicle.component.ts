import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {VehicleModel} from "../../core/entity/vehiclemodel";


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
  vehicleForm!:FormGroup;

  vehiclestatuses: VehicleStatus[] = [];
  vehiclemodels: VehicleModel[] = [];
  vehicletypes: VehicleType[] = [];
  mohs: Moh[] = [];
  vehicles: Vehicle[] = [];

  regexes:any;

  dataSource!: MatTableDataSource<Vehicle>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentVehicle!: Vehicle;
  oldVehicle!: Vehicle;

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

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

    this.vehicleForm = this.fb.group({
      "number": new FormControl('',[Validators.required]),
      "doattached": new FormControl('',[Validators.required]),
      "yom": new FormControl('',[Validators.required]),
      "capacity": new FormControl('',[Validators.required]),
      "currentmeterreading": new FormControl('',[Validators.required]),
      "lastregdate": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "vehiclestatus": new FormControl(null,[Validators.required]),
      "vehicletype": new FormControl(null,[Validators.required]),
      "vehiclemodel": new FormControl(null,[Validators.required]),
      "moh": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
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

  createForm(){
    this.vehicleForm.controls['number'].setValidators([Validators.required]);
    this.vehicleForm.controls['doattached'].setValidators([Validators.required]);
    this.vehicleForm.controls['yom'].setValidators([Validators.required]);
    this.vehicleForm.controls['capacity'].setValidators([Validators.required]);
    this.vehicleForm.controls['currentmeterreading'].setValidators([Validators.required]);
    this.vehicleForm.controls['lastregdate'].setValidators([Validators.required]);
    this.vehicleForm.controls['description'].setValidators([Validators.required]);
    this.vehicleForm.controls['vehiclestatus'].setValidators([Validators.required]);
    this.vehicleForm.controls['vehicletype'].setValidators([Validators.required]);
    this.vehicleForm.controls['vehiclemodel'].setValidators([Validators.required]);
    this.vehicleForm.controls['moh'].setValidators([Validators.required]);

    for (const controlName in this.vehicleForm.controls) {
      const control = this.vehicleForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldVehicle != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentVehicle[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  fillForm(vehicle:Vehicle){

    this.enableButtons(false,true,true);

    this.currentVehicle = vehicle;
    this.oldVehicle = this.currentVehicle;

    this.vehicleForm.setValue({
      number: this.currentVehicle.number,
      doattached: this.currentVehicle.doattached,
      yom: this.currentVehicle.yom,
      capacity: this.currentVehicle.capacity,
      currentmeterreading: this.currentVehicle.currentmeterreading,
      lastregdate: this.currentVehicle.lastregdate,
      description: this.currentVehicle.description,

      vehiclestatus: this.currentVehicle.vehiclestatus?.id,
      vehicletype: this.currentVehicle.vehicletype?.id,
      vehiclemodel: this.currentVehicle.vehiclemodel?.id,
      moh: this.currentVehicle.moh?.id
    });

    this.vehicleForm.markAsPristine();

    //this.currentOperation = 'Update'+ " '" + this.currentMoh.name + "'" + this.getUpdates();

  }

  handleSearch() {

  }

  clearSearch() {

  }


  add() {

  }

  update(vehicle:Vehicle){}

  delete(currentVehicle: any) {

  }

  clearForm() {

  }
}
