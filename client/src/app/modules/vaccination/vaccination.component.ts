import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
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
              ) {

    this.vaccinationSearchForm = this.fb.group({
      "sschildrecords": new FormControl(''),
      "ssvaccineoffering": new FormControl(''),
      "ssvaccinationprogress": new FormControl(''),
      "ssclinic": new FormControl(''),
    },{updateOn:"change"});
  }
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");
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

  handleSearch() {

  }

  clearSearch() {

  }

  fillForm(vaccination: any) {
    
  }
}
