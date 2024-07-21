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
              private snackBar:MatSnackBar,
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

    this.rs.getRegexes('moh').subscribe({
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

    this.clinicForm.setValue({
      divisionname: this.currentClinic.divisionname,
      divisionno: this.currentClinic.divisionno,
      clinicdate: this.currentClinic.clinicdate,
      tostart: this.currentClinic.tostart,
      toend: this.currentClinic.toend,
      description: this.currentClinic.description,
      location: this.currentClinic.location,


      employee: this.currentClinic.employee?.id,
      clinicstatus: this.currentClinic.clinicstatus?.id,
      clinictype: this.currentClinic.clinictype?.id,
      moh: this.currentClinic.moh?.id
    });

    this.clinicForm.markAsPristine();
  }

  handleSearch() {

  }

  clearSearch() {

  }



  add() {

  }

  update(currentClinic: Clinic) {

  }

  deleteUser(currentClinic: Clinic) {

  }

  clearForm() {

  }
}
