import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {ProductOrder} from "../../core/entity/productorder";
import {ProductorderService} from "../../core/service/productorder/productorder.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {MatTableDataSource} from "@angular/material/table";
import {Moh} from "../../core/entity/moh";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MohService} from "../../core/service/moh/moh.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {Employee} from "../../core/entity/employee";
import {Product} from "../../core/entity/product";
import {ProductOrderStatus} from "../../core/entity/productorderstatus";
import {ProductOrderStatusService} from "../../core/service/productorder/productorderstatus.service";
import {ProductService} from "../../core/service/productorder/product.service";
import {ProductOrderProducts} from "../../core/entity/productorderproducts";
import {RegexService} from "../../core/service/regexes/regex.service";

@Component({
  selector: 'app-producorder',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatGridList,
    MatGridTile,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent,
    AsyncPipe
  ],
  templateUrl: './producorder.component.html',
  styleUrl: './producorder.component.scss'
})
export class ProducorderComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  porders: ProductOrder[] = [];
  mohs: Moh[] = [];
  employees: Employee[] = [];
  products: Product[] = [];
  postatuses: ProductOrderStatus[] = [];
  innerdata: ProductOrderProducts[] = [];

  inndata!: ProductOrderProducts;
  oldInndata!: ProductOrderProducts;

  product: any;

  productOrder!:ProductOrder;
  oldProductOrder!:ProductOrder;

  dataSource!: MatTableDataSource<ProductOrder>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  poSearchForm!:FormGroup;
  porderForm!:FormGroup;
  innerForm!:FormGroup;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  regexes:any;

  constructor(
    private pos:ProductorderService,
    private cdr:ChangeDetectorRef,
    private ms: MohService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private poss: ProductOrderStatusService,
    private ps:ProductService,
    private rs:RegexService
              ) {
    this.porderForm = this.fb.group({
      "dorequired": new FormControl('',[Validators.required]),
      "dorequested": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "grandtotal": new FormControl('',[Validators.required]),
      "moh": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "productorderstatus": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});

    this.innerForm = this.fb.group({
      "quentity": new FormControl('',[Validators.required]),
      "product": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
  }


  ngOnInit(): void {
    this.initialize();

  }

  initialize(){

    this.loadTable("");

    this.ms.getAllMohs("").subscribe({
      next: data => this.mohs = data
    });

    this.es.getAllEmployeesList("").subscribe({
      next: data => this.employees = data
    });

    this.poss.getAllProductOrderStatuses().subscribe({
      next: data => this.postatuses = data
    });

    this.ps.getAllProducts().subscribe({
      next: data => this.products = data
    });

    this.rs.getRegexes('productorder').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.pos.getAllProductOrders().subscribe({
      next:data =>{
        this.porders = data
        this.dataSource = new MatTableDataSource(this.porders);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.porderForm.controls['dorequired'].setValidators([Validators.required]);
    this.porderForm.controls['dorequested'].setValidators([Validators.required]);
    this.porderForm.controls['description'].setValidators([Validators.required]);
    this.porderForm.controls['moh'].setValidators([Validators.required]);
    this.porderForm.controls['employee'].setValidators([Validators.required]);
    this.porderForm.controls['productorderstatus'].setValidators([Validators.required]);

    this.innerForm.controls['quentity'].setValidators([Validators.required]);
    this.innerForm.controls['product'].setValidators([Validators.required]);

    Object.values(this.porderForm.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.porderForm.controls) {
      const control = this.porderForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldProductOrder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.productOrder[controlName]) {
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
            if (value === this.inndata[controlName]) {
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

  fillForm(porder:ProductOrder){
    this.enableButtons(false,true,true);

    this.productOrder = porder;
    this.oldProductOrder = this.productOrder;

    this.innerdata = this.productOrder.productorderproducts;

    console.log(porder)

    this.porderForm.setValue({
      employee: this.productOrder.employee.id,
      moh: this.productOrder.moh.id,
      dorequested: this.productOrder.dorequested,
      dorequired: this.productOrder.dorequired,
      productorderstatus: this.productOrder.productorderstatus,
      description: this.productOrder.description,
      grandtotal: this.productOrder.grandtotal,
    })

    this.porderForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id = 0;
  linetotal = 0;

  addToTable(){

    const productid = this.innerForm.controls['product'].value;
    const quentity = this.innerForm.controls['quentity'].value;

    this.ps.getProduct(productid).subscribe({
      next: data => this.product = data
    });

    console.log(this.product);

    const unitprice = this.product?.cost;

    if(unitprice != null){
      this.linetotal = this.calculateLineTotal(unitprice,quentity);
    }


    if(this.product){

      let op = new ProductOrderProducts(this.id,this.product,quentity,this.linetotal);

      this.innerdata.push(op);

      this.id++;

      //this.calculateGrandTotal();
      this.innerForm.reset();
    }
  }

  calculateLineTotal(unitprice:number,qty:number){
     return  qty * unitprice;
    }

  add(){}
  update(porder:ProductOrder){}
  delete(porder:ProductOrder){}
  clearForm(){}

  handleSearch(){}
  clearSearch(){}

}
