import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
              private voss: VaccineorderstatusService
  ) {

    this.voSearchForm = this.fb.group({
      "sscode": new FormControl(''),
      "ssdorequired": new FormControl(''),
      "ssdorequested": new FormControl(''),
      "ssmoh": new FormControl(''),
      "ssvorderstatus": new FormControl(''),
    },{updateOn: 'change'});
  }

  ngOnInit() {

    this.initialize();
  }

  initialize(){
    this.loadTable("");
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

  handleSearch() {

  }

  clearSearch() {

  }

  fillForm(vorder: any) {

  }
}
