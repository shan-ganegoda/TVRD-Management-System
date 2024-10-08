import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatPaginator} from "@angular/material/paginator";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {ProductOrder} from "../../core/entity/productorder";
import {ProductorderService} from "../../core/service/productorder/productorder.service";
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
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {ToastService} from "../../core/util/toast/toast.service";

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
export class ProducorderComponent implements OnInit {

  isLoading = false;
  isFailed = false;

  porders: ProductOrder[] = [];
  mohs: Moh[] = [];
  employees: Employee[] = [];
  products: Product[] = [];
  postatuses: ProductOrderStatus[] = [];
  innerdata: ProductOrderProducts[] = [];
  //productorderproducts: ProductOrderProducts[] = [];

  inndata!: any;
  oldInndata!: any;

  product!: Product;

  productOrder!: ProductOrder;
  oldProductOrder!: ProductOrder;

  currentOperation = '';

  dataSource!: MatTableDataSource<ProductOrder>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Product Order-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Product Order-Delete"); //need to be false
  protected hasWriteAuthority = this.authorizationService.hasAuthority("Product Order-Write");
  protected hasReadAuthority = this.authorizationService.hasAuthority("Product Order-Read");

  poSearchForm!: FormGroup;
  porderForm!: FormGroup;
  innerForm!: FormGroup;

  isInnerDataUpdated:boolean = false;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  constructor(
    private pos: ProductorderService,
    private cdr: ChangeDetectorRef,
    private ms: MohService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private poss: ProductOrderStatusService,
    private ps: ProductService,
    private rs: RegexService,
    private dialog: MatDialog,
    private tst: ToastService,
    private authorizationService:AuthorizationService,
  ) {
    this.porderForm = this.fb.group({
      "dorequired": new FormControl('', [Validators.required]),
      "code": new FormControl('', [Validators.required]),
      "dorequested": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "grandtotal": new FormControl('', [Validators.required]),
      "moh": new FormControl(null, [Validators.required]),
      "employee": new FormControl(null, [Validators.required]),
      "productorderstatus": new FormControl(null, [Validators.required]),
    }, {updateOn: 'change'});

    this.innerForm = this.fb.group({
      "quentity": new FormControl(''),
      "product": new FormControl(null),
    }, {updateOn: 'change'});

    this.poSearchForm = this.fb.group({
      "ssporderstatus": new FormControl(''),
      "sscode": new FormControl(''),
      "ssdorequested": new FormControl(''),
      "ssmoh": new FormControl(''),
    }, {updateOn: 'change'});
  }


  ngOnInit(): void {
    this.initialize();

  }

  initialize() {

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

    this.es.getAllEmployeesList("?designationid=1&employeestatusid=1").subscribe({
      next: data => this.employees = data
    });

    this.poss.getAllProductOrderStatuses().subscribe({
      next: data => this.postatuses = data
    });

    this.ps.getAllProducts().subscribe({
      next: data => this.products = data
    });

    this.rs.getRegexes('productorder').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query: string) {
    this.pos.getAllProductOrders(query).subscribe({
      next: data => {
        this.porders = data
        this.dataSource = new MatTableDataSource(this.porders);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm() {
    this.porderForm.controls['dorequired'].setValidators([Validators.required]);
    this.porderForm.controls['code'].setValidators([Validators.required, Validators.pattern(this.regexes['code']['regex'])]);
    this.porderForm.controls['dorequested'].setValidators([Validators.required]);
    this.porderForm.controls['description'].setValidators([Validators.required]);
    this.porderForm.controls['moh'].setValidators([Validators.required]);
    this.porderForm.controls['employee'].setValidators([Validators.required]);
    this.porderForm.controls['productorderstatus'].setValidators([Validators.required]);

    this.innerForm.controls['quentity'].setValidators([Validators.required]);
    this.innerForm.controls['product'].setValidators([Validators.required]);

    Object.values(this.porderForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

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

    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  fillForm(porder: ProductOrder) {
    this.enableButtons(false, true, true);

    this.productOrder = porder;
    this.oldProductOrder = this.productOrder;

    this.innerdata = this.productOrder.productorderproducts;


    this.porderForm.patchValue({
      employee: this.productOrder.employee.id,
      code: this.productOrder.code,
      moh: this.productOrder.moh.id,
      dorequested: this.productOrder.dorequested,
      dorequired: this.productOrder.dorequired,
      productorderstatus: this.productOrder.productorderstatus.id,
      description: this.productOrder.description,
      grandtotal: this.productOrder.grandtotal,
    })

    this.porderForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

    //disable all field for supplier and enable just status to update
    if(this.authorizationService.hasRole('Supplier')){
      this.porderForm.disable();
      this.porderForm.controls['productorderstatus'].enable();
      this.innerForm.disable();
    }

    //if status is completed diable the status
    if(this.productOrder.productorderstatus.id == 5){
      this.porderForm.controls['productorderstatus'].disable();
    }else{
      this.porderForm.controls['productorderstatus'].enable();
    }

    const v1 = this.postatuses.find(e=> e.id == 1 )
    const v2 = this.postatuses.find(e=> e.id == 2 )
    const v3 = this.postatuses.find(e=> e.id == 3 )
    const v4 = this.postatuses.find(e=> e.id == 4 )
    const v5 = this.postatuses.find(e=> e.id == 5 )

    //if status is in product disable other options
    if(this.productOrder.productorderstatus.id == 4){


      this.postatuses = [];
      if (v4 && v5) {
        this.postatuses.push(v4);
        this.postatuses.push(v5);

      }
      //if not show all statuses
    }else{
      this.postatuses = [];
     if(v1&&v2&&v3){
       this.postatuses.push(v1,v2,v3)
     }
    }


  }

  id = 0;
  linetotal = 0;
  grandtotal = 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.product == null || this.inndata.quentity == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Product Order Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.inndata != null) {

        this.calculateLineTotal(this.inndata.product.cost, this.inndata.quentity)

        let orderp = new ProductOrderProducts(this.id, this.inndata.product, this.inndata.quentity, this.linetotal);

        let tem: ProductOrderProducts[] = [];
        if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

        this.innerdata = [];
        tem.forEach((t) => this.innerdata.push(t));

        // Clear the original array
        this.innerdata = [];

        // Add the existing records back to the original array
        tem.forEach((t) => this.innerdata.push(t));

        // Check if the new record already exists in the array
        let exists = this.innerdata.some(record => record.product?.id === orderp.product?.id);

        if (!exists) {
          // If it does not exist, add the new record
          this.innerdata.push(orderp);
        } else {
          // If it exists, you can handle it as needed, e.g., show a message
          this.dialog.open(WarningDialogComponent, {
            data: {heading: "Errors - Product Order Add ", message: "Duplicate record.<br>This record already exists in the table."}
          }).afterClosed().subscribe(res => {
            if (!res) {
              return;
            }
          });
        }

        this.id++;

        this.calculateGrandTotal();
        this.innerForm.reset();
        this.isInnerDataUpdated = true;

        for (const controlName in this.innerForm.controls) {
          this.innerForm.controls[controlName].clearValidators();
          this.innerForm.controls[controlName].updateValueAndValidity();
        }
      }
    }

  }

  calculateLineTotal(unitprice: number, qty: number) {
    this.linetotal = qty * unitprice;
  }

  calculateGrandTotal() {
    this.grandtotal = 0;

    this.innerdata.forEach((e) => {
      this.grandtotal = this.grandtotal + e.linetotal;
    });

    this.porderForm.controls['grandtotal'].setValue(this.grandtotal);
  }

  deleteRow(x: any) {

    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Delete Product Quentity"})
      .afterClosed().subscribe(res => {
      if (res) {

        const index = datasources.findIndex(item => item.id === x.id);

        if (index > -1) {
          datasources.splice(index, 1);
        }

        this.innerdata = datasources;
        this.calculateGrandTotal();
        this.isInnerDataUpdated = true;
      }
    });
  }

  filterEmployee(){
    let mohid = this.porderForm.controls['moh'].value;
    this.ms.getMohById(parseInt(mohid)).subscribe({
      next: data => {
        const moh = data;
        this.porderForm.controls['employee'].setValue(moh.employee?.id);
      }
    });
  }


  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.porderForm.controls) {
      const control = this.porderForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "Product Quentity Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.porderForm.controls) {
      const control = this.porderForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Product Quentity";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - ProductOrder Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.porderForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);

        const porder:ProductOrder = {
          dorequired: this.porderForm.controls['dorequired'].value,
          code: this.porderForm.controls['code'].value,
          dorequested: this.porderForm.controls['dorequested'].value,
          grandtotal: this.porderForm.controls['grandtotal'].value,
          description: this.porderForm.controls['description'].value,
          productorderproducts: this.innerdata,

          productorderstatus: {id: parseInt(this.porderForm.controls['productorderstatus'].value)},
          moh: {id: parseInt(this.porderForm.controls['moh'].value)},
          employee: {id: parseInt(this.porderForm.controls['employee'].value)},
        }

        //console.log(porder);
        this.currentOperation = "Add Product Order";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.pos.savePorder(porder).subscribe({
              next: () => {
                this.tst.handleResult('success',"POrder Saved Successfully");
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

  update(prorder: ProductOrder) {

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Product Order Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Product Order Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const porder:ProductOrder = {
              id: prorder.id,
              code: this.porderForm.controls['code'].value,
              dorequired: this.porderForm.controls['dorequired'].value,
              dorequested: this.porderForm.controls['dorequested'].value,
              grandtotal: this.porderForm.controls['grandtotal'].value,
              description: this.porderForm.controls['description'].value,
              productorderproducts: this.innerdata,

              productorderstatus: {id: parseInt(this.porderForm.controls['productorderstatus'].value)},
              moh: {id: parseInt(this.porderForm.controls['moh'].value)},
              employee: {id: parseInt(this.porderForm.controls['employee'].value)},
            }

            this.currentOperation = "Product Order Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.pos.updatePorder(porder).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"POrder Updated Successfully");
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
          data:{heading:"Updates - ProductOrder Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(porder: ProductOrder) {
    const operation = "Delete Product Order " + porder.moh.name;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && porder.id){
        this.pos.deletePorder(porder.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","POrder Deleted Successfully");
            this.clearForm();
          },

          error: (err:any) => {
            this.tst.handleResult("Failed",err.error.data.message);
          }
        });
      }
    });
  }

  clearForm() {
    this.porderForm.reset();
    this.porderForm.controls['moh'].setValue(null);
    this.porderForm.controls['employee'].setValue(null);
    this.porderForm.controls['productorderstatus'].setValue(null);
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);

  }

  handleSearch() {
    const ssmoh  = this.poSearchForm.controls['ssmoh'].value;
    const ssporderstatus  = this.poSearchForm.controls['ssporderstatus'].value;
    const sscode  = this.poSearchForm.controls['sscode'].value;
    const ssdorequested  = this.poSearchForm.controls['ssdorequested'].value;

    let query = ""

    if(sscode != null && sscode.trim() !="") query = query + "&code=" + sscode;
    if(ssdorequested != null && ssdorequested.trim() !="") query = query + "&dorequested=" + ssdorequested;
    if(ssmoh != '') query = query + "&mohid=" + parseInt(ssmoh);
    if(ssporderstatus != '') query = query + "&postatusid=" + parseInt(ssporderstatus);

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
        this.poSearchForm.reset();
        this.poSearchForm.controls['ssmoh'].setValue('');
        this.poSearchForm.controls['ssporderstatus'].setValue('');
        this.loadTable("");
      }
    });
  }

  generateCode() {
    let mohid = this.porderForm.controls['moh'].value;

    if(mohid == null){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Generate Code ",message: "Please Select MOH First "}
      }).afterClosed().subscribe(res =>{
        if(res){return;}
      })
    }else{
      this.ms.getMohById(parseInt(mohid)).subscribe({
        next: data=> {
          let moh = data;

          const today = new Date();
          const date = today.getDate();
          const month = today.getMonth()+1;
          const year = today.getFullYear();

          const formatteddate = (date < 10 ? '0' : '') + date;
          const formattedmonth = (month < 10 ? '0' : '') + month;

          this.porderForm.controls['code'].setValue(`O${moh.codename}${year}${formattedmonth}${formatteddate}`);
          this.porderForm.controls['dorequested'].setValue(`${year}-${formattedmonth}-${formatteddate}`);
        }
      });
    }

  }
}
