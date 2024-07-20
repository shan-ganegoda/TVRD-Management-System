import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {ProductOrder} from "../../core/entity/productorder";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {VaccineOrder} from "../../core/entity/vaccineorder";
import {Moh} from "../../core/entity/moh";
import {Employee} from "../../core/entity/employee";
import {Product} from "../../core/entity/product";
import {ProductOrderStatus} from "../../core/entity/productorderstatus";
import {ProductOrderProducts} from "../../core/entity/productorderproducts";
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

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  vorders: VaccineOrder[] = [];
  mohs: Moh[] = [];
  employees: Employee[] = [];
  vaccines: Vaccine[] = [];
  vostatuses: VaccineOrderStatus[] = [];
  innerdata: VaccineOrderVaccine[] = [];

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
              private snackBar: MatSnackBar
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
    this.vorderForm.controls['code'].setValidators([Validators.required]);
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

    if (this.inndata != null) {

      let orderv = new VaccineOrderVaccine(this.id, this.inndata.vaccine, this.inndata.quentity);

      let tem: VaccineOrderVaccine[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      this.innerdata = [];
      tem.forEach((t) => this.innerdata.push(t));

      this.innerdata.push(orderv);

      this.id++;

      this.innerForm.reset();

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
      }
    }

  }

  deleteRow(x: any) {

    let datasources = this.innerdata;

    const index = datasources.findIndex(item => item.id === x.id);

    if (index > -1) {
      datasources.splice(index, 1);
    }

    this.innerdata = datasources;

  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.vorderForm.controls) {
      const control = this.vorderForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
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
                this.handleResult('success');
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.handleResult('failed');
              }
            });
          }
        })
      }

    }
  }

  handleSearch() {

  }

  clearSearch() {

  }


  update(vaccineOrder: any) {

  }

  delete(vaccineOrder: any) {

  }

  clearForm() {

  }

  handleResult(status: string) {

    if (status === "success") {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {message: status, icon: "done_all"},
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    } else {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {message: status, icon: "report"},
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['failure-snackbar'],
      });
    }
  }
}
