import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Vaccination} from "../../core/entity/vaccination";
import {MatTableDataSource} from "@angular/material/table";
import {Grn} from "../../core/entity/grn";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {Clinic} from "../../core/entity/clinic";
import {ChildRecord} from "../../core/entity/childrecord";
import {VaccineOffering} from "../../core/entity/vaccineoffering";
import {VaccinationStatus} from "../../core/entity/vaccinationstatus";
import {VaccinationProgress} from "../../core/entity/vaccinationprogress";
import {ToastService} from "../../core/util/toast/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {VaccinationService} from "../../core/service/vaccination/vaccination.service";
import {VaccinationstatusService} from "../../core/service/vaccination/vaccinationstatus.service";
import {VaccinationprogressService} from "../../core/service/vaccination/vaccinationprogress.service";
import {VaccineofferingService} from "../../core/service/vaccine/vaccineoffering.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {ChildrecordService} from "../../core/service/childrecords/childrecord.service";
import {RouterLink} from "@angular/router";
import {VaccineService} from "../../core/service/vaccine/vaccine.service";
import {Vaccine} from "../../core/entity/vaccine";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {VaccinationRecord} from "../../core/entity/vaccinationrecord";
import {RegexService} from "../../core/service/regexes/regex.service";

@Component({
  selector: 'app-vaccination',
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
  templateUrl: './vaccination.component.html',
  styleUrl: './vaccination.component.scss'
})
export class VaccinationComponent implements OnInit{

  vaccinationForm!:FormGroup;
  vaccinationSearchForm!:FormGroup;
  innerForm!: FormGroup;

  oldVaccination!:Vaccination;
  currentVaccination!:Vaccination;

  inndata!: any;
  oldInndata!: any;

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  dataSource!: MatTableDataSource<Vaccination>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = this.am.hasAuthority("Vaccination-Update");
  hasDeleteAuthority = this.am.hasAuthority("Vaccination-Delete");
  hasWriteAuthority = this.am.hasAuthority("Vaccination-Write");
  hasReadAuthority = this.am.hasAuthority("Vaccination-Read");

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  clinics:Clinic[] = [];
  childs:ChildRecord[] = [];
  vofferings:VaccineOffering[] = [];
  vaccinations: Vaccination[] = [];
  vaccinationstatuses: VaccinationStatus[] = [];
  vaccinationprogresses: VaccinationProgress[] = [];
  innerdata: VaccinationRecord[] = [];

  isInnerDataUpdated:boolean = false;

  constructor(
              private am:AuthorizationService,
              private fb:FormBuilder,
              private tst:ToastService,
              private cdr:ChangeDetectorRef,
              private dialog:MatDialog,
              private vs:VaccinationService,
              private vss:VaccinationstatusService,
              private vps:VaccinationprogressService,
              private vos:VaccineofferingService,
              private cs:ClinicService,
              private crs:ChildrecordService,
              private rs:RegexService
              ) {

    this.vaccinationSearchForm = this.fb.group({
      "sschildrecords": new FormControl(''),
      "ssvaccineoffering": new FormControl(''),
      "ssvaccinationprogress": new FormControl(''),
      "ssclinic": new FormControl(''),
    },{updateOn:"change"});

    this.vaccinationForm = this.fb.group({
      "lastupdated": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "clinic": new FormControl(null,[Validators.required]),
      "childrecords": new FormControl(null,[Validators.required]),
      "vaccinationprogress": new FormControl(null,[Validators.required]),
    },{updateOn:"change"});

    this.innerForm = this.fb.group({
      "date": new FormControl(''),
      "vaccineoffering": new FormControl(null),
      "vaccinationstatus": new FormControl(null),
    },{updateOn:"change"});
  }
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.cs.getAllList().subscribe({
      next:data => this.clinics = data,
    });

    this.crs.getAll("").subscribe({
      next:data => this.childs = data,
    });

    this.vps.getAll().subscribe({
      next:data => this.vaccinationprogresses = data,
    });

    this.vss.getAll().subscribe({
      next:data => this.vaccinationstatuses = data,
    });

    this.vos.getAll().subscribe({
      next:data => this.vofferings = data,
    });

    this.rs.getRegexes('vaccination').subscribe({
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
        this.vaccinations = data;
        this.dataSource = new MatTableDataSource(this.vaccinations);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm() {
    this.vaccinationForm.controls['clinic'].setValidators([Validators.required]);
    this.vaccinationForm.controls['childrecords'].setValidators([Validators.required]);
    this.vaccinationForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.vaccinationForm.controls['vaccinationprogress'].setValidators([Validators.required]);
    this.vaccinationForm.controls['lastupdated'].setValidators([Validators.required]);

    this.innerForm.controls['vaccineoffering'].setValidators([Validators.required]);
    this.innerForm.controls['vaccinationstatus'].setValidators([Validators.required]);
    this.innerForm.controls['date'].setValidators([Validators.required]);

    Object.values(this.vaccinationForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.vaccinationForm.controls) {
      const control = this.vaccinationForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldVaccination != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentVaccination[controlName]) {
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

  fillForm(vaccination: Vaccination) {
    this.enableButtons(false, true, true);

    this.currentVaccination = vaccination;
    this.oldVaccination = this.currentVaccination;

    this.innerdata = this.currentVaccination.vaccinationrecords;


    this.vaccinationForm.patchValue({
      lastupdated: this.currentVaccination.lastupdated,
      clinic: this.currentVaccination.clinic?.id,
      childrecords: this.currentVaccination.childrecords?.id,
      vaccinationprogress: this.currentVaccination.vaccinationprogress?.id,
      description: this.currentVaccination.description,
    })

    //this.porderForm.patchValue(this.productOrder);

    this.vaccinationForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }
  }

  addToTable() {

  }

  deleteRow(indata: VaccinationRecord) {

  }

  add() {

  }

  update(currentVaccination: Vaccination) {

  }

  delete(currentVaccination: Vaccination) {

  }

  clearForm() {
    this.vaccinationForm.reset();
    this.vaccinationForm.controls['clinic'].setValue(null);
    this.vaccinationForm.controls['childrecords'].setValue(null);
    this.vaccinationForm.controls['vaccinationprogress'].setValue(null);
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);
  }

  handleSearch() {

  }

  clearSearch() {

  }


}
