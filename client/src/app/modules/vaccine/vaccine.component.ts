import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {VaccineStatus} from "../../core/entity/vaccinestatus";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {MatTableDataSource} from "@angular/material/table";
import {ProductOrder} from "../../core/entity/productorder";
import {Observable} from "rxjs";
import {Vaccine} from "../../core/entity/vaccine";
import {VaccineService} from "../../core/service/vaccine/vaccine.service";

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

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  vaccineSearchForm!: FormGroup;

  currentVaccine!:Vaccine;
  oldVaccine!:Vaccine;

  vaccinestatuses: VaccineStatus[] = [];
  vaccines: Vaccine[] = [];

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  constructor(
              private fb:FormBuilder,
              private vs:VaccineService,
              private cdr:ChangeDetectorRef
  ) {

    this.vaccineSearchForm = this.fb.group({
      "ssname": new FormControl(''),
      "sscode": new FormControl(''),
      "ssvaccinestatus": new FormControl(''),
      "ssofferedinstitute": new FormControl(''),
    }, {updateOn: 'change'});
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.loadTable("");
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

  handleSearch() {

  }

  clearSearch() {

  }

  fillForm(currentvaccine: any) {

  }
}
