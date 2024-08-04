import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {VaccineOrder} from "../../core/entity/vaccineorder";
import {Moh} from "../../core/entity/moh";
import {Employee} from "../../core/entity/employee";
import {Vaccine} from "../../core/entity/vaccine";
import {VaccineOrderStatus} from "../../core/entity/vaccineorderstatus";
import {VaccineOrderVaccine} from "../../core/entity/vaccineordervaccine";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {MohService} from "../../core/service/moh/moh.service";
import {VaccineorderService} from "../../core/service/vaccineorder/vaccineorder.service";
import {VaccineorderstatusService} from "../../core/service/vaccineorder/vaccineorderstatus.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {VaccineService} from "../../core/service/vaccine/vaccine.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationComponent} from "../../shared/dialog/notification/notification.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {ToastService} from "../../core/util/toast/toast.service";

@Component({
  selector: 'app-vaccineorder',
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
  templateUrl: './vaccineorder.component.html',
  styleUrl: './vaccineorder.component.scss'
})
export class VaccineorderComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  inndata!: any;
  oldInndata!: any;

  dataSource!: MatTableDataSource<VaccineOrder>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Product Order-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Product Order-Delete"); //need to be false
  protected hasWriteAuthority = this.authorizationService.hasAuthority("Product Order-Write");
  protected hasReadAuthority = this.authorizationService.hasAuthority("Product Order-Read");

  vorders: VaccineOrder[] = [];
  mohs: Moh[] = [];
  employees: Employee[] = [];
  vaccines: Vaccine[] = [];
  vostatuses: VaccineOrderStatus[] = [];
  innerdata: VaccineOrderVaccine[] = [];

  isInnerDataUpdated:boolean = false;

  vaccineOrder!: VaccineOrder;
  oldVaccineOrder!: VaccineOrder;

  voSearchForm!: FormGroup;
  vorderForm!: FormGroup;
  innerForm!: FormGroup;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  constructor(
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private es: EmployeeService,
              private ms: MohService,
              private vos: VaccineorderService,
              private voss: VaccineorderstatusService,
              private vs: VaccineService,
              private rs: RegexService,
              private dialog: MatDialog,
              private tst:ToastService,
              private authorizationService:AuthorizationService
  ) {

    this.voSearchForm = this.fb.group({
      "sscode": new FormControl(''),
      "ssdorequired": new FormControl(''),
      "ssdorequested": new FormControl(''),
      "ssmoh": new FormControl(''),
      "ssvorderstatus": new FormControl(''),
    },{updateOn: 'change'});

    this.vorderForm = this.fb.group({
      "dorequired": new FormControl('', [Validators.required]),
      "code": new FormControl('', [Validators.required]),
      "dorequested": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "moh": new FormControl(null, [Validators.required]),
      "employee": new FormControl(null, [Validators.required]),
      "vaccineorderstatus": new FormControl(null, [Validators.required]),
    }, {updateOn: 'change'});

    this.innerForm = this.fb.group({
      "quentity": new FormControl(''),
      "vaccine": new FormControl(null),
    }, {updateOn: 'change'});
  }

  ngOnInit() {

    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.ms.getAllMohs("").subscribe({
      next: data => {
        this.mohs = data;
        if(this.mohs){
          // @ts-ignore
          this.mohs.sort((a,b) => a.name.localeCompare(b.name))
        }
      }
    });

    this.es.getAllEmployeesList("").subscribe({
      next: data => this.employees = data
    });

    this.vs.getAll("").subscribe({
      next: data => this.vaccines = data
    });

    this.voss.getAll().subscribe({
      next: data => this.vostatuses = data
    });

    this.rs.getRegexes('vaccineorder').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.vos.getAll(query).subscribe({
      next: data => {
        this.vorders = data
        this.dataSource = new MatTableDataSource(this.vorders);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
        // console.log(query);
      }
    });
  }

  createForm() {
    this.vorderForm.controls['dorequired'].setValidators([Validators.required]);
    this.vorderForm.controls['code'].setValidators([Validators.required, Validators.pattern(this.regexes['code']['regex'])]);
    this.vorderForm.controls['dorequested'].setValidators([Validators.required]);
    this.vorderForm.controls['description'].setValidators([Validators.required]);
    this.vorderForm.controls['moh'].setValidators([Validators.required]);
    this.vorderForm.controls['employee'].setValidators([Validators.required]);
    this.vorderForm.controls['vaccineorderstatus'].setValidators([Validators.required]);

    this.innerForm.controls['quentity'].setValidators([Validators.required]);
    this.innerForm.controls['vaccine'].setValidators([Validators.required]);

    Object.values(this.vorderForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.vorderForm.controls) {
      const control = this.vorderForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldVaccineOrder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.vorderForm[controlName]) {
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

    for (const controlName in this.innerForm.controls) {
      const control = this.innerForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldInndata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerForm[controlName]) {
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

    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  fillForm(vorder: VaccineOrder) {
    this.enableButtons(false, true, true);

    this.vaccineOrder = vorder;
    this.oldVaccineOrder = this.vaccineOrder;

    this.innerdata = this.vaccineOrder.vaccineordervaccines;


    this.vorderForm.patchValue({
      employee: this.vaccineOrder.employee.id,
      code: this.vaccineOrder.code,
      moh: this.vaccineOrder.moh.id,
      dorequested: this.vaccineOrder.dorequested,
      dorequired: this.vaccineOrder.dorequired,
      vaccineorderstatus: this.vaccineOrder.vaccineorderstatus.id,
      description: this.vaccineOrder.description,
    })

    //this.porderForm.patchValue(this.productOrder);

    this.vorderForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id = 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.vaccine == null || this.inndata.quentity == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Product Order Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.inndata != null) {

        let orderv = new VaccineOrderVaccine(this.id, this.inndata.vaccine, this.inndata.quentity);

        let tem: VaccineOrderVaccine[] = [];
        if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

        this.innerdata = [];
        tem.forEach((t) => this.innerdata.push(t));

        this.innerdata.push(orderv);

        this.id++;

        this.innerForm.reset();
        this.isInnerDataUpdated = true;

        for (const controlName in this.innerForm.controls) {
          this.innerForm.controls[controlName].clearValidators();
          this.innerForm.controls[controlName].updateValueAndValidity();
        }
      }
    }

  }

  deleteRow(x: any) {

    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Delete Vaccine Quentity"})
      .afterClosed().subscribe(res => {
      if (res) {

        const index = datasources.findIndex(item => item.id === x.id);

        if (index > -1) {
          datasources.splice(index, 1);
        }

        this.innerdata = datasources;
        this.isInnerDataUpdated = true;
      }
    });
  }

  filterEmployee(event:any){
    let mohid = event.target.value;
    this.ms.getMohById(parseInt(mohid)).subscribe({
      next: data => {
        const moh = data;
        this.vorderForm.controls['employee'].setValue(moh.employee?.id);
      }
    });
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.vorderForm.controls) {
      const control = this.vorderForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "Vaccine Quentity Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.vorderForm.controls) {
      const control = this.vorderForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Vaccine Quentity";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccine Order Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.vorderForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);

        const vorder:VaccineOrder = {
          dorequired: this.vorderForm.controls['dorequired'].value,
          code: this.vorderForm.controls['code'].value,
          dorequested: this.vorderForm.controls['dorequested'].value,
          description: this.vorderForm.controls['description'].value,
          vaccineordervaccines: this.innerdata,

          vaccineorderstatus: {id: parseInt(this.vorderForm.controls['vaccineorderstatus'].value)},
          moh: {id: parseInt(this.vorderForm.controls['moh'].value)},
          employee: {id: parseInt(this.vorderForm.controls['employee'].value)},
        }

        //console.log(porder);
        this.currentOperation = "Add Vaccine Order";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.vos.save(vorder).subscribe({
              next: () => {
                this.tst.handleResult('success',"VaccineOrder Saved Successfully");
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.tst.handleResult('Failed',err.error.data.message);
              }
            });
          }
        })
      }

    }
  }

  update(currentvorder: VaccineOrder) {

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Vaccine Order Update ",message: "You Have Following Errors <br>" + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Vaccine Order Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const vorder:VaccineOrder = {
              id: currentvorder.id,
              dorequired: this.vorderForm.controls['dorequired'].value,
              code: this.vorderForm.controls['code'].value,
              dorequested: this.vorderForm.controls['dorequested'].value,
              description: this.vorderForm.controls['description'].value,
              vaccineordervaccines: this.innerdata,

              vaccineorderstatus: {id: parseInt(this.vorderForm.controls['vaccineorderstatus'].value)},
              moh: {id: parseInt(this.vorderForm.controls['moh'].value)},
              employee: {id: parseInt(this.vorderForm.controls['employee'].value)},
            }

            this.currentOperation = "Product Order Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.vos.update(vorder).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"VaccineOrder Updated Successfully");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.tst.handleResult('Failed',err.error.data.message);
                    //console.log(err);
                  }
                });
              }
            })

          }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - VaccineOrder Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(vorder: VaccineOrder) {
    const operation = "Delete Vaccine Order " + vorder.code;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && vorder.id){
        this.vos.delete(vorder.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","VaccineOrder Deleted Successfully");
            this.clearForm();
          },

          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    });
  }

  handleSearch() {
    const ssmoh  = this.voSearchForm.controls['ssmoh'].value;
    const sscode  = this.voSearchForm.controls['sscode'].value;
    const ssvorderstatus  = this.voSearchForm.controls['ssvorderstatus'].value;
    const ssdorequired  = this.voSearchForm.controls['ssdorequired'].value;
    const ssdorequested  = this.voSearchForm.controls['ssdorequested'].value;

    let query = ""

    if(ssdorequired != null && ssdorequired.trim() !="") query = query + "&dorequired=" + ssdorequired;
    if(ssdorequested != null && ssdorequested.trim() !="") query = query + "&dorequested=" + ssdorequested;
    if(sscode != null && sscode.trim() !="") query = query + "&code=" + sscode;
    if(ssmoh != '') query = query + "&mohid=" + parseInt(ssmoh);
    if(ssvorderstatus != '') query = query + "&vostatusid=" + parseInt(ssvorderstatus);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.voSearchForm.reset();
        this.voSearchForm.controls['ssmoh'].setValue('');
        this.voSearchForm.controls['ssporderstatus'].setValue('');
        this.loadTable("");
      }
    });
  }


  clearForm() {

        this.vorderForm.reset();
        this.vorderForm.controls['moh'].setValue(null);
        this.vorderForm.controls['employee'].setValue(null);
        this.vorderForm.controls['vaccineorderstatus'].setValue(null);
        this.innerdata = [];
        this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);
  }

  generateCode() {
    let mohid = this.vorderForm.controls['moh'].value;

    if(mohid == null){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Generate Code ",message: "Please Select MOH First "}
      }).afterClosed().subscribe(res =>{
        if(res){return;}
      })
    }else{
      this.ms.getMohById(parseInt(mohid)).subscribe({
        next: data=> {
          let moh = data;

          const today = new Date();
          const date = today.getDate();
          const month = today.getMonth();
          const year = today.getFullYear();

          const formatteddate = (date < 10 ? '0' : '') + date;
          const formattedmonth = (month < 10 ? '0' : '') + month;

          this.vorderForm.controls['code'].setValue(`VO${moh.codename}${year}${formattedmonth}${formatteddate}`);
        }
      });
    }

  }
}
