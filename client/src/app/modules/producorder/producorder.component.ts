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
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {NotificationComponent} from "../../shared/dialog/notification/notification.component";

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

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  poSearchForm!: FormGroup;
  porderForm!: FormGroup;
  innerForm!: FormGroup;

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
    private snackBar: MatSnackBar
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
      "ssdorequired": new FormControl(''),
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
        // console.log(query);
      }
    });
  }

  createForm() {
    this.porderForm.controls['dorequired'].setValidators([Validators.required]);
    this.porderForm.controls['code'].setValidators([Validators.required]);
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

    //this.porderForm.patchValue(this.productOrder);

    this.porderForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id = 0;
  linetotal = 0;
  grandtotal = 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata != null) {

      this.calculateLineTotal(this.inndata.product.cost, this.inndata.quentity)

      let orderp = new ProductOrderProducts(this.id, this.inndata.product, this.inndata.quentity, this.linetotal);

      let tem: ProductOrderProducts[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      this.innerdata = [];
      tem.forEach((t) => this.innerdata.push(t));

      this.innerdata.push(orderp);

      this.id++;

      this.calculateGrandTotal();
      this.innerForm.reset();

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
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

    const index = datasources.findIndex(item => item.id === x.id);

    if (index > -1) {
      datasources.splice(index, 1);
    }

    this.innerdata = datasources;
    this.calculateGrandTotal();

  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.porderForm.controls) {
      const control = this.porderForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
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
                this.handleResult('success');
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.handleResult('failed');
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
                    this.handleResult('success');
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.handleResult('failed');
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
            this.handleResult("success");
            this.clearForm();
          },

          error: () => {
            this.handleResult("failed");
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

    this.enableButtons(true,false,false);

  }

  handleSearch() {
    const ssmoh  = this.poSearchForm.controls['ssmoh'].value;
    const ssporderstatus  = this.poSearchForm.controls['ssporderstatus'].value;
    const ssdorequired  = this.poSearchForm.controls['ssdorequired'].value;
    const ssdorequested  = this.poSearchForm.controls['ssdorequested'].value;

    let query = ""

    if(ssdorequired != null && ssdorequired.trim() !="") query = query + "&dorequired=" + ssdorequired;
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

  handleResult(status: string) {

    if (status === "success") {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {message: status, icon: "done_all"},
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    } else {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {message: status, icon: "report"},
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['failure-snackbar'],
      });
    }
  }

}
