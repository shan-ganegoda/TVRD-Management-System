import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Clinic} from "../../core/entity/clinic";
import {Employee} from "../../core/entity/employee";
import {Moh} from "../../core/entity/moh";
import {ClinicStatus} from "../../core/entity/clinicstatus";
import {ClinicType} from "../../core/entity/clinictype";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MohService} from "../../core/service/moh/moh.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {ClinicstatusService} from "../../core/service/clinic/clinicstatus.service";
import {ClinictypeService} from "../../core/service/clinic/clinictype.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {NotificationComponent} from "../../shared/dialog/notification/notification.component";
import {ToastService} from "../../core/util/toast/toast.service";

@Component({
  selector: 'app-clinic',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatGridList,
    MatGridTile,
    AsyncPipe,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent
  ],
  templateUrl: './clinic.component.html',
  styleUrl: './clinic.component.scss'
})
export class ClinicComponent implements OnInit{

  clinicForm!: FormGroup;
  clinicSearchForm!: FormGroup;

  isLoading = false;
  isFailed = false;

  currentClinic!:Clinic;
  oldClinic!:Clinic;

  employees: Employee[] = [];
  mohs: Moh[] = [];
  clinics: Clinic[] = [];
  clinicstatuses: ClinicStatus[] = [];
  clinictypes: ClinicType[] = [];

  dataSource!: MatTableDataSource<Clinic>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  regexes:any;

  currentOperation = '';

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
              private fb:FormBuilder,
              private ms:MohService,
              private cs:ClinicService,
              private es:EmployeeService,
              private css:ClinicstatusService,
              private cts:ClinictypeService,
              private rs:RegexService,
              private dialog:MatDialog,
              private tst:ToastService,
              private cdr:ChangeDetectorRef
  ) {
    this.clinicSearchForm = this.fb.group({
      "ssdivisionname": new FormControl(''),
      "ssdivisionno": new FormControl(''),
      "ssclinicstatus": new FormControl(''),
      "ssclinictype": new FormControl('')
    },{updateOn:'change'});

    this.clinicForm = this.fb.group({
      "divisionname": new FormControl('',[Validators.required]),
      "divisionno": new FormControl('',[Validators.required]),
      "clinicdate": new FormControl('',[Validators.required]),
      "tostart": new FormControl('',[Validators.required]),
      "toend": new FormControl('',[Validators.required]),
      "location": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "moh": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "clinictype": new FormControl(null,[Validators.required]),
      "clinicstatus": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit() {
    this.initialized();
  }

  initialized(){
    this.loadTable("");

    this.es.getAllEmployeesList("?designationid=4").subscribe({
      next: data => this.employees = data
    });

    this.ms.getAllMohsList().subscribe({
      next: data => this.mohs = data,
    });

    this.css.getAll().subscribe({
      next: data => this.clinicstatuses = data,
    });

    this.cts.getAll().subscribe({
      next: data => this.clinictypes = data,
    });

    this.rs.getRegexes('clinic').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.cs.getAll(query).subscribe({
      next:data =>{
        this.clinics = data;
        this.dataSource = new MatTableDataSource(this.clinics);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.clinicForm.controls['divisionname'].setValidators([Validators.required,Validators.pattern(this.regexes['divisionname']['regex'])]);
    this.clinicForm.controls['divisionno'].setValidators([Validators.required,Validators.pattern(this.regexes['divisionno']['regex'])]);
    this.clinicForm.controls['clinicdate'].setValidators([Validators.required]);
    this.clinicForm.controls['tostart'].setValidators([Validators.required,Validators.pattern(this.regexes['tostart']['regex'])]);
    this.clinicForm.controls['toend'].setValidators([Validators.required,Validators.pattern(this.regexes['toend']['regex'])]);
    this.clinicForm.controls['location'].setValidators([Validators.required]);
    this.clinicForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.clinicForm.controls['moh'].setValidators([Validators.required]);
    this.clinicForm.controls['employee'].setValidators([Validators.required]);
    this.clinicForm.controls['clinictype'].setValidators([Validators.required]);
    this.clinicForm.controls['clinicstatus'].setValidators([Validators.required]);

    for (const controlName in this.clinicForm.controls) {
      const control = this.clinicForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldClinic != undefined && control.valid) {
            // @ts-ignore
            if (value === this.clinicForm[controlName]) {
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

  fillForm(clinic: Clinic) {
    this.enableButtons(false,true,true);

    this.currentClinic = clinic;
    this.oldClinic = this.currentClinic;

    // @ts-ignore
    const [shours, sminutes, sseconds] = this.currentClinic.tostart.split(":");
    // @ts-ignore
    const [ehours, eminutes, eseconds] = this.currentClinic.toend.split(":");

    this.clinicForm.setValue({
      divisionname: this.currentClinic.divisionname,
      divisionno: this.currentClinic.divisionno,
      clinicdate: this.currentClinic.clinicdate,
      tostart: `${shours}:${sminutes}`,
      toend: `${ehours}:${eminutes}`,
      description: this.currentClinic.description,
      location: this.currentClinic.location,


      employee: this.currentClinic.employee?.id,
      clinicstatus: this.currentClinic.clinicstatus?.id,
      clinictype: this.currentClinic.clinictype?.id,
      moh: this.currentClinic.moh?.id
    });

    this.clinicForm.markAsPristine();
  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.clinicForm.controls) {
      const control = this.clinicForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.clinicForm.controls){
      const control = this.clinicForm.controls[controlName];
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
        data:{heading:"Errors - Clinic Add ",message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.clinicForm.valid){

            const clinic:Clinic = {
              divisionname: this.clinicForm.controls['divisionname'].value,
              divisionno: this.clinicForm.controls['divisionno'].value,
              clinicdate: this.clinicForm.controls['clinicdate'].value,
              tostart: this.clinicForm.controls['tostart'].value,
              toend: this.clinicForm.controls['toend'].value,
              location: this.clinicForm.controls['location'].value,
              description: this.clinicForm.controls['description'].value,

              employee: {id: parseInt(this.clinicForm.controls['employee'].value)},
              moh: {id: parseInt(this.clinicForm.controls['moh'].value)},
              clinicstatus: {id: parseInt(this.clinicForm.controls['clinicstatus'].value)},
              clinictype: {id: parseInt(this.clinicForm.controls['clinictype'].value)},
            }


            this.currentOperation = "Add Clinic " + clinic.divisionname;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.cs.save(clinic).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Clinic Saved Successfully");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.tst.handleResult('failed',err.error.data.message);
                  }
                });
          }
        });
      }
    }
  }

  update(currentClinic: Clinic) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Clinic Update ",message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Clinic Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const clinic:Clinic = {
              divisionname: this.clinicForm.controls['divisionname'].value,
              divisionno: this.clinicForm.controls['divisionno'].value,
              clinicdate: this.clinicForm.controls['clinicdate'].value,
              tostart: this.clinicForm.controls['tostart'].value,
              toend: this.clinicForm.controls['toend'].value,
              location: this.clinicForm.controls['location'].value,
              description: this.clinicForm.controls['description'].value,

              employee: {id: parseInt(this.clinicForm.controls['employee'].value)},
              moh: {id: parseInt(this.clinicForm.controls['moh'].value)},
              clinicstatus: {id: parseInt(this.clinicForm.controls['clinicstatus'].value)},
              clinictype: {id: parseInt(this.clinicForm.controls['clinictype'].value)},
            }

                  clinic.id = currentClinic.id;

                  this.currentOperation = "Update Clinic " + clinic.divisionname;

                  this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
                    .afterClosed().subscribe(res => {
                    if(res) {
                      this.cs.update(clinic).subscribe({
                        next:() => {
                          this.tst.handleResult('success',"Clinic Updated Successfully");
                          this.loadTable("");
                          this.clearForm();
                        },
                        error:(err:any) => {
                          this.tst.handleResult('failed',err.error.data.message);
                        }
                      });
                    }
                  })
                }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Clinic Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentClinic: Clinic) {
    const operation = "Delete Clinic " + currentClinic.divisionname;

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (currentClinic.id) {
          this.cs.delete(currentClinic.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success',"Clinic Deleted Successfully");
              this.clearForm();
            },
            error: (err:any) => {
              this.tst.handleResult('failed',err.error.data.message);
              console.log(err);
            },
          });
        }
      }
    })
  }

  clearForm() {
    this.clinicForm.reset();
    this.clinicForm.controls['employee'].setValue(null);
    this.clinicForm.controls['moh'].setValue(null);
    this.clinicForm.controls['clinicstatus'].setValue(null);
    this.clinicForm.controls['clinictype'].setValue(null);

    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssdivisionname  = this.clinicSearchForm.controls['ssdivisionname'].value;
    const ssdivisionno  = this.clinicSearchForm.controls['ssdivisionno'].value;
    const ssclinicstatus  = this.clinicSearchForm.controls['ssclinicstatus'].value;
    const ssclinictype  = this.clinicSearchForm.controls['ssclinictype'].value;

    let query = ""

    if(ssdivisionname != null && ssdivisionname.trim() !="") query = query + "&divisionname=" + ssdivisionname;
    if(ssdivisionno != null && ssdivisionno.trim() !="") query = query + "&divisionno=" + ssdivisionno;
    if(ssclinicstatus != '') query = query + "&clinicstatusid=" + parseInt(ssclinicstatus);
    if(ssclinictype != '') query = query + "&clinictypeid=" + parseInt(ssclinictype);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"}
    ).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.clinicSearchForm.reset();
        this.clinicSearchForm.controls['ssclinicstatus'].setValue('');
        this.clinicSearchForm.controls['ssclinictype'].setValue('');
        this.loadTable("");
      }
    });
  }

}
