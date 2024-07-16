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
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {NotificationComponent} from "../../shared/dialog/notification/notification.component";


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

  currentOperation = "";

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

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.vehicleForm.controls) {
      const control = this.vehicleForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.vehicleForm.controls){
      const control = this.vehicleForm.controls[controlName];
      if(control.errors){
        if(this.regexes[controlName] != undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Vehicle Add ",message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.vehicleForm.valid){

            const vehicle:Vehicle = {
              number: this.vehicleForm.controls['number'].value,
              doattached: this.vehicleForm.controls['doattached'].value,
              yom: this.vehicleForm.controls['yom'].value,
              capacity: this.vehicleForm.controls['capacity'].value,
              currentmeterreading: this.vehicleForm.controls['currentmeterreading'].value,
              description: this.vehicleForm.controls['description'].value,
              lastregdate: this.vehicleForm.controls['lastregdate'].value,

              vehiclestatus: {id: parseInt(this.vehicleForm.controls['vehiclestatus'].value)},
              vehicletype: {id: parseInt(this.vehicleForm.controls['vehicletype'].value)},
              vehiclemodel: {id: parseInt(this.vehicleForm.controls['vehiclemodel'].value)},
              moh: {id: parseInt(this.vehicleForm.controls['moh'].value)},
            }

            console.log(vehicle);

            this.currentOperation = "Add Vehicle " + vehicle.number;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.vs.save(vehicle).subscribe({
                  next:() => {
                    this.handleResult('success');
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.handleResult('failed');
                  }
                });
              }
            })
          }
      }
    }

  update(currentvehicle:Vehicle){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Vehicle Update ",message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Vehicle Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            if(this.vehicleForm.valid){

              const vehicle:Vehicle = {
                number: this.vehicleForm.controls['number'].value,
                doattached: this.vehicleForm.controls['doattached'].value,
                yom: this.vehicleForm.controls['yom'].value,
                capacity: this.vehicleForm.controls['capacity'].value,
                currentmeterreading: this.vehicleForm.controls['currentmeterreading'].value,
                description: this.vehicleForm.controls['description'].value,
                lastregdate: this.vehicleForm.controls['lastregdate'].value,

                vehiclestatus: {id: parseInt(this.vehicleForm.controls['vehiclestatus'].value)},
                vehicletype: {id: parseInt(this.vehicleForm.controls['vehicletype'].value)},
                vehiclemodel: {id: parseInt(this.vehicleForm.controls['vehiclemodel'].value)},
                moh: {id: parseInt(this.vehicleForm.controls['moh'].value)},
              }

                  vehicle.id = currentvehicle.id;

                  this.currentOperation = "Update Vehicle " + currentvehicle.number;

                  this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
                    .afterClosed().subscribe(res => {
                    if(res) {
                      this.vs.update(vehicle).subscribe({
                        next:() => {
                          this.handleResult('success');
                          this.loadTable("");
                          this.clearForm();
                        },
                        error:(err:any) => {
                          this.handleResult('failed');
                        }
                      });
                    }
                  })
                }

            }

        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Vehicle Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentVehicle: Vehicle) {

    const operation = "Delete Vehicle " + currentVehicle.number;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (currentVehicle.id) {
          this.vs.delete(currentVehicle.id).subscribe({
            next: () => {
              this.loadTable("");
              this.handleResult('success');
              this.clearForm();
            },
            error: (err:any) => {
              this.handleResult('failed');
              console.log(err);
            },
          });
        } else {
          this.handleResult('failed');
        }
      }
    })
  }

  clearForm() {
    this.vehicleForm.reset();
    this.vehicleForm.controls['moh'].setValue(null);
    this.vehicleForm.controls['vehiclestatus'].setValue(null);
    this.vehicleForm.controls['vehiclemodel'].setValue(null);
    this.vehicleForm.controls['vehicletype'].setValue(null);

    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssnumber  = this.vehicleSearchForm.controls['ssnumber'].value;
    const ssstatus  = this.vehicleSearchForm.controls['ssstatus'].value;
    const sstype = this.vehicleSearchForm.controls['sstype'].value;
    const ssmoh  = this.vehicleSearchForm.controls['ssmoh'].value;

    let query = ""

    if(ssnumber != null && ssnumber.trim() !="") query = query + "&number=" + ssnumber;
    if(ssstatus != '') query = query + "&vehiclestatusid=" + parseInt(ssstatus);
    if(sstype != '') query = query + "&vehicletypeid=" + parseInt(sstype);
    if(ssmoh != '') query = query + "&mohid=" + parseInt(ssmoh);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"}
    ).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.vehicleSearchForm.reset();
        this.vehicleSearchForm.controls['ssstatus'].setValue('');
        this.vehicleSearchForm.controls['sstype'].setValue('');
        this.vehicleSearchForm.controls['ssmoh'].setValue('');
        this.loadTable("");
      }
    });
  }




handleResult(status:string){

  if(status === "success"){
    this.snackBar.openFromComponent(NotificationComponent,{
      data:{ message: status,icon: "done_all" },
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }else{
    this.snackBar.openFromComponent(NotificationComponent,{
      data:{ message: status,icon: "report" },
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 5000,
      panelClass: ['failure-snackbar'],
    });
  }
}

}
