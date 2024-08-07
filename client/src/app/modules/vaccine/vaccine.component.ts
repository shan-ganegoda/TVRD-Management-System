import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {VaccineStatus} from "../../core/entity/vaccinestatus";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {MatTableDataSource} from "@angular/material/table";

import {Observable} from "rxjs";
import {Vaccine} from "../../core/entity/vaccine";
import {VaccineService} from "../../core/service/vaccine/vaccine.service";
import {Dose} from "../../core/entity/dose";
import {VaccinationStage} from "../../core/entity/vaccinationstage";

import {VaccineOffering} from "../../core/entity/vaccineoffering";
import {Employee} from "../../core/entity/employee";
import {VaccinationstageService} from "../../core/service/vaccine/vaccinationstage.service";
import {VaccinestatusService} from "../../core/service/vaccine/vaccinestatus.service";
import {DoseService} from "../../core/service/vaccine/dose.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/util/toast/toast.service";
import {AuthorizationService} from "../../core/service/auth/authorization.service";

@Component({
  selector: 'app-vaccine',
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
  templateUrl: './vaccine.component.html',
  styleUrl: './vaccine.component.scss'
})
export class VaccineComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  dataSource!: MatTableDataSource<Vaccine>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = this.am.hasAuthority("Vaccine-Update");
  hasDeleteAuthority = this.am.hasAuthority("Vaccine-Delete");
  hasReadAuthority = this.am.hasAuthority("Vaccine-Read");
  hasWriteAuthority = this.am.hasAuthority("Vaccine-Write");

  vaccineSearchForm!: FormGroup;
  vaccineForm!: FormGroup;
  innerForm!: FormGroup;

  currentVaccine!:Vaccine;
  oldVaccine!:Vaccine;

  inndata!: any;
  oldInndata!: any;

  vaccinestatuses: VaccineStatus[] = [];
  vaccines: Vaccine[] = [];
  doses: Dose[] = [];
  vaccinationstages: VaccinationStage[] = [];
  innerdata: VaccineOffering[] = [];
  employees: Employee[] = [];

  isInnerDataUpdated:boolean = false;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  constructor(
              private fb:FormBuilder,
              private vs:VaccineService,
              private cdr:ChangeDetectorRef,
              private vss:VaccinationstageService,
              private vsts:VaccinestatusService,
              private ds:DoseService,
              private es:EmployeeService,
              private rs:RegexService,
              private dialog: MatDialog,
              private am: AuthorizationService,
              private tst:ToastService
  ) {

    this.vaccineSearchForm = this.fb.group({
      "ssname": new FormControl(''),
      "sscode": new FormControl(''),
      "ssvaccinestatus": new FormControl(''),
      "ssofferedinstitute": new FormControl(''),
    }, {updateOn: 'change'});

    this.vaccineForm = this.fb.group({
      "name": new FormControl('',[Validators.required]),
      "code": new FormControl('',[Validators.required]),
      "dosecount": new FormControl('',[Validators.required]),
      "containindications": new FormControl('',[Validators.required]),
      "dosaved": new FormControl('',[Validators.required]),
      "offeredinstitute": new FormControl('',[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "vaccinestatus": new FormControl(null,[Validators.required]),
    }, {updateOn: 'change'});

    this.innerForm = this.fb.group({
      "dose": new FormControl(null),
      "vaccinationstage": new FormControl(null),
      "year": new FormControl(''),
      "month": new FormControl(''),
    }, {updateOn: 'change'});
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.ds.getAll().subscribe({
      next: data => this.doses = data
    });

    this.vss.getAll().subscribe({
      next: data => this.vaccinationstages = data
    });

    this.vsts.getAll().subscribe({
      next: data => this.vaccinestatuses = data
    });

    this.es.getAllEmployeesList("?designationid=1").subscribe({
      next: data => this.employees = data
    });

    this.rs.getRegexes('vaccine').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.vs.getAll(query).subscribe({
      next: data => {
        this.vaccines = data
        this.dataSource = new MatTableDataSource(this.vaccines);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
        // console.log(query);
      }
    });
  }

  createForm() {
    this.vaccineForm.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.vaccineForm.controls['code'].setValidators([Validators.required,Validators.pattern(this.regexes['code']['regex'])]);
    this.vaccineForm.controls['dosecount'].setValidators([Validators.required,Validators.pattern(this.regexes['dosecount']['regex'])]);
    this.vaccineForm.controls['containindications'].setValidators([Validators.required,Validators.pattern(this.regexes['containindications']['regex'])]);
    this.vaccineForm.controls['dosaved'].setValidators([Validators.required]);
    this.vaccineForm.controls['offeredinstitute'].setValidators([Validators.required]);
    this.vaccineForm.controls['vaccinestatus'].setValidators([Validators.required]);
    this.vaccineForm.controls['employee'].setValidators([Validators.required]);

    this.innerForm.controls['dose'].setValidators([Validators.required]);
    this.innerForm.controls['vaccinationstage'].setValidators([Validators.required]);
    this.innerForm.controls['year'].setValidators([Validators.required]);
    this.innerForm.controls['month'].setValidators([Validators.required]);

    Object.values(this.vaccineForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.vaccineForm.controls) {
      const control = this.vaccineForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldVaccine != undefined && control.valid) {
            // @ts-ignore
            if (value === this.vaccineForm[controlName]) {
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

  fillForm(vaccine: any) {
    this.enableButtons(false, true, true);

    this.currentVaccine = vaccine;
    this.oldVaccine = this.currentVaccine;

    console.log(this.currentVaccine.employee.id);

    this.innerdata = this.currentVaccine.vaccineofferings;

    this.vaccineForm.patchValue({
      code: this.currentVaccine.code,
      name: this.currentVaccine.name,
      offeredinstitute: this.currentVaccine.offeredinstitute,
      dosecount: this.currentVaccine.dosecount,
      containindications: this.currentVaccine.containindications,
      dosaved: this.currentVaccine.dosaved,

      employee: this.currentVaccine.employee?.id,
      vaccinestatus: this.currentVaccine.vaccinestatus?.id,

    })

    //this.porderForm.patchValue(this.productOrder);

    this.vaccineForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id= 0;
  title = "";

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.dose == null || this.inndata.vaccinationstage == null || this.inndata.year == "" || this.inndata.month == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccine Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if(this.vaccineForm.controls['name'].value != ""){
        this.title = this.vaccineForm.controls['name'].value + " " + this.inndata.dose.id;
      }
      let vaccineof = new VaccineOffering(this.id, this.inndata.dose, this.inndata.vaccinationstage, this.inndata.year,this.inndata.month,this.title);

      let tem: VaccineOffering[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      this.innerdata = [];
      tem.forEach((t) => this.innerdata.push(t));

      // Check if the new record already exists in the array
      let exists = this.innerdata.some(record => record.dose?.id === vaccineof.dose?.id);

      if (!exists) {
        // If it does not exist, add the new record
        this.innerdata.push(vaccineof);
      } else {
        // If it exists, you can handle it as needed, e.g., show a message
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Errors - Vaccine Dose Add ", message: "Duplicate record.<br> This record already exists in the table."}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
      }

      this.id++;

      this.isInnerDataUpdated = true;
      this.innerForm.reset();

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
      }
    }

  }

  deleteRow(indata: VaccineOffering) {
    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Vaccine Offering Details Delete"})
      .afterClosed().subscribe(res => {
      if (res) {

        const index = datasources.findIndex(item => item.id === indata.id);

        if (index > -1) {
          datasources.splice(index, 1);
        }

        this.isInnerDataUpdated = true;
        this.innerdata = datasources;
      }

    });
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.vaccineForm.controls) {
      const control = this.vaccineForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "Vaccine Offering Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.vaccineForm.controls) {
      const control = this.vaccineForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Vaccine Offering";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccine Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.vaccineForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);

        const vaccine:Vaccine = {
          name: this.vaccineForm.controls['name'].value,
          code: this.vaccineForm.controls['code'].value,
          dosecount: this.vaccineForm.controls['dosecount'].value,
          dosaved: this.vaccineForm.controls['dosaved'].value,
          containindications: this.vaccineForm.controls['containindications'].value,
          offeredinstitute: this.vaccineForm.controls['offeredinstitute'].value,

          vaccineofferings: this.innerdata,

          vaccinestatus: {id: parseInt(this.vaccineForm.controls['vaccinestatus'].value)},
          employee: {id: parseInt(this.vaccineForm.controls['employee'].value)},
        }

        //console.log(porder);
        this.currentOperation = "Add Vaccine ";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.vs.save(vaccine).subscribe({
              next: () => {
                this.tst.handleResult('success',"Vaccine Saved Successfully");
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.tst.handleResult('failed',err.error.data.message);
              }
            });
          }
        })
      }

    }
  }

  updates(currentVaccine: Vaccine) {

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Vaccine Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Vaccine Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const vaccine:Vaccine = {
              name: this.vaccineForm.controls['name'].value,
              code: this.vaccineForm.controls['code'].value,
              dosecount: this.vaccineForm.controls['dosecount'].value,
              dosaved: this.vaccineForm.controls['dosaved'].value,
              containindications: this.vaccineForm.controls['containindications'].value,
              offeredinstitute: this.vaccineForm.controls['offeredinstitute'].value,

              vaccineofferings: this.innerdata,

              vaccinestatus: {id: parseInt(this.vaccineForm.controls['vaccinestatus'].value)},
              employee: {id: parseInt(this.vaccineForm.controls['employee'].value)},
            }

            vaccine.id = currentVaccine.id;

            this.currentOperation = "Vaccine Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.vs.update(vaccine).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Vaccine Successfully Update");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.tst.handleResult('failed',err.error.data.message);
                    //console.log(err);
                  }
                });
              }
            })

          }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Vaccine Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentVaccine: Vaccine) {
    const operation = "Delete Vaccine " + currentVaccine.name;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && currentVaccine.id){
        this.vs.delete(currentVaccine.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Vaccine Deleted Successfully");
            this.clearForm();
          },

          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    });
  }

  clearForm() {

        this.vaccineForm.reset();
        this.vaccineForm.controls['employee'].setValue(null);
        this.vaccineForm.controls['vaccinestatus'].setValue(null);
        this.innerdata = [];

        this.isInnerDataUpdated = false;
        this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssname  = this.vaccineSearchForm.controls['ssname'].value;
    const sscode  = this.vaccineSearchForm.controls['sscode'].value;
    const ssvaccinestatus  = this.vaccineSearchForm.controls['ssvaccinestatus'].value;
    const ssofferedinstitute  = this.vaccineSearchForm.controls['ssofferedinstitute'].value;

    let query = ""

    if(ssname != null && ssname.trim() !="") query = query + "&name=" + ssname;
    if(sscode != null && sscode.trim() !="") query = query + "&code=" + sscode;
    if(ssofferedinstitute != null && ssofferedinstitute.trim() !="") query = query + "&offeredinstitute=" + ssofferedinstitute;
    if(ssvaccinestatus != '') query = query + "&vaccinestatusid=" + parseInt(ssvaccinestatus);

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
        this.vaccineSearchForm.reset();
        this.vaccineSearchForm.controls['ssvaccinestatus'].setValue('');
        this.loadTable("");
      }
    });
  }

}
