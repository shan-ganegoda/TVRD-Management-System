import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Mother} from "../../core/entity/mother";
import {HealthStatus} from "../../core/entity/healthstatus";
import {ChildRecord} from "../../core/entity/childrecord";
import {BloodType} from "../../core/entity/bloodtype";
import {Gender} from "../../core/entity/gender";
import {InvolvementStatus} from "../../core/entity/involvementstatus";
import {MatTableDataSource} from "@angular/material/table";
import {Clinic} from "../../core/entity/clinic";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {GenderService} from "../../core/service/employee/gender.service";
import {MotherService} from "../../core/service/motherregistration/mother.service";
import {InvolvementstatusService} from "../../core/service/motherregistration/involvementstatus.service";
import {HealthstatusService} from "../../core/service/childrecords/healthstatus.service";
import {BloodtypeService} from "../../core/service/motherregistration/bloodtype.service";
import {ChildrecordService} from "../../core/service/childrecords/childrecord.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastService} from "../../core/util/toast/toast.service";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";

@Component({
  selector: 'app-childrecord',
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
  templateUrl: './childrecord.component.html',
  styleUrl: './childrecord.component.scss'
})
export class ChildrecordComponent implements OnInit{

  childRecordForm!:FormGroup;
  childRecordSearchForm!:FormGroup;

  isLoading = false;
  isFailed = false;

  currentChildRecord!:ChildRecord;
  oldChildRecord!:ChildRecord;

  mothers:Mother[] = [];
  healthstatuses:HealthStatus[] = [];
  childs:ChildRecord[] = [];
  bloodtypes:BloodType[] = [];
  genders:Gender[] = [];
  involvementstatuses:InvolvementStatus[] = [];

  dataSource!: MatTableDataSource<ChildRecord>;
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
              private gs:GenderService,
              private ms:MotherService,
              private is:InvolvementstatusService,
              private hs:HealthstatusService,
              private bs:BloodtypeService,
              private cs:ChildrecordService,
              private rs:RegexService,
              private dialog:MatDialog,
              private tst:ToastService,
              private cdr:ChangeDetectorRef
  ) {

    this.childRecordSearchForm = this.fb.group({
      "ssregno": new FormControl(''),
      "ssfullname": new FormControl(''),
      "ssgender": new FormControl(''),
      "sshealthstatus": new FormControl(''),
    },{updateOn:'change'});

    this.childRecordForm = this.fb.group({
      "fullname": new FormControl("",[Validators.required]),
      "regno": new FormControl("",[Validators.required]),
      "dobirth": new FormControl("",[Validators.required]),
      "doregistered": new FormControl("",[Validators.required]),
      "birthweight": new FormControl("",[Validators.required]),
      "headperimeter": new FormControl("",[Validators.required]),
      "heightinbirth": new FormControl("",[Validators.required]),
      "placeofbirth": new FormControl("",[Validators.required]),
      "apgarscore": new FormControl("",[Validators.required]),

      "gender": new FormControl(null,[Validators.required]),
      "mother": new FormControl(null,[Validators.required]),
      "bloodtype": new FormControl(null,[Validators.required]),
      "healthstatus": new FormControl(null,[Validators.required]),
      "involvementstatus": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.gs.getGenderList().subscribe({
      next:data => this.genders = data,
    });

    this.hs.getAll().subscribe({
      next:data => this.healthstatuses = data,
    });

    this.ms.getAll("").subscribe({
      next:data => this.mothers = data,
    });

    this.bs.getAll().subscribe({
      next:data => this.bloodtypes = data,
    });

    this.is.getAll().subscribe({
      next:data => this.involvementstatuses = data,
    });
  }

  loadTable(query:string){
    this.cs.getAll(query).subscribe({
      next:data =>{
        this.childs = data;
        this.dataSource = new MatTableDataSource(this.childs);
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

  fillForm(child: any) {

  }

  add() {

  }

  update(currentChildRecord: ChildRecord) {

  }

  delete(currentChildRecord: ChildRecord) {

  }

  clearForm() {

  }
}
