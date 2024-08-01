import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Grn} from "../../core/entity/grn";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../core/entity/employee";
import {GrnStatus} from "../../core/entity/grnstatus";
import {ProductorderService} from "../../core/service/productorder/productorder.service";
import {ProductOrder} from "../../core/entity/productorder";
import {Product} from "../../core/entity/product";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {GrnService} from "../../core/service/grn/grn.service";
import {GrnstatusService} from "../../core/service/grn/grnstatus.service";
import {ProductService} from "../../core/service/productorder/product.service";
import {ToastService} from "../../core/util/toast/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {GrnProduct} from "../../core/entity/grnproduct";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";

@Component({
  selector: 'app-grn',
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
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss'
})
export class GrnComponent implements OnInit{

  grnForm!:FormGroup;
  grnSearchForm!:FormGroup;
  innerForm!: FormGroup;

  oldGrn!:Grn;
  currentGrn!:Grn;

  inndata!: any;
  oldInndata!: any;

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  dataSource!: MatTableDataSource<Grn>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = this.am.hasAuthority("Grn-Update");
  hasDeleteAuthority = this.am.hasAuthority("Grn-Delete");
  hasWriteAuthority = this.am.hasAuthority("Grn-Write");
  hasReadAuthority = this.am.hasAuthority("Grn-Read");

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  isInnerDataUpdated:boolean = false;

  employees:Employee[] = [];
  grns:Grn[] = [];
  grnstatuses:GrnStatus[] = [];
  productorders:ProductOrder[] = [];
  products:Product[] = [];
  innerdata:GrnProduct[]=[];


  constructor(
              private fb:FormBuilder,
              private cdr:ChangeDetectorRef,
              private es:EmployeeService,
              private gs:GrnService,
              private gss:GrnstatusService,
              private pos:ProductorderService,
              private ps:ProductService,
              private tst:ToastService,
              private dialog:MatDialog,
              private rs:RegexService,
              private am:AuthorizationService
  ) {
    this.grnSearchForm = this.fb.group({
      "sscode": new FormControl(''),
      "ssgrnstatus": new FormControl(''),
      "ssdate": new FormControl(''),
    },{updateOn:"change"});

    this.grnForm = this.fb.group({
      "code": new FormControl('',[Validators.required]),
      "date": new FormControl('',[Validators.required]),
      "time": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "bagscount": new FormControl('',[Validators.required]),
      "railwaystation": new FormControl('',[Validators.required]),
      "grnstatus": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "productorder": new FormControl(null,[Validators.required]),
    },{updateOn:"change"});

    this.innerForm = this.fb.group({
      "product": new FormControl(null),
      "quentity": new FormControl(''),
    },{updateOn:"change"});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.gss.getAll().subscribe({
      next: data => this.grnstatuses = data,
    });

    this.es.getAllEmployeesList("?designation=1").subscribe({
      next: data => this.employees = data,
    });

    this.ps.getAllProducts().subscribe({
      next: data => this.products = data,
    });

    this.pos.getAllProductOrders("").subscribe({
      next: data => this.productorders = data,
    });

    this.rs.getRegexes('grn').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.gs.getAll(query).subscribe({
      next: data => {
        this.grns = data;
        this.dataSource = new MatTableDataSource(this.grns);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm() {
    this.grnForm.controls['date'].setValidators([Validators.required]);
    this.grnForm.controls['time'].setValidators([Validators.required]);
    this.grnForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.grnForm.controls['code'].setValidators([Validators.required,Validators.pattern(this.regexes['code']['regex'])]);
    this.grnForm.controls['bagscount'].setValidators([Validators.required,Validators.pattern(this.regexes['bagscount']['regex'])]);
    this.grnForm.controls['railwaystation'].setValidators([Validators.required,Validators.pattern(this.regexes['railwaystation']['regex'])]);
    this.grnForm.controls['grnstatus'].setValidators([Validators.required]);
    this.grnForm.controls['employee'].setValidators([Validators.required]);
    this.grnForm.controls['productorder'].setValidators([Validators.required]);

    this.innerForm.controls['product'].setValidators([Validators.required]);
    this.innerForm.controls['quentity'].setValidators([Validators.required]);

    Object.values(this.grnForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldGrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentGrn[controlName]) {
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

  fillForm(grn: Grn) {
    this.enableButtons(false, true, true);

    this.currentGrn = grn;
    this.oldGrn = this.currentGrn;

    this.innerdata = this.currentGrn.grnproducts;

    this.grnForm.patchValue({
      code: this.currentGrn.code,
      date: this.currentGrn.date,
      time: this.currentGrn.time,
      description: this.currentGrn.description,
      bagscount: this.currentGrn.bagscount,
      railwaystation: this.currentGrn.railwaystation,

      employee: this.currentGrn.employee?.id,
      grnstatus: this.currentGrn.grnstatus?.id,
      productorder: this.currentGrn.productorder?.id,

    })

    //this.porderForm.patchValue(this.productOrder);

    this.grnForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id= 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.product == null) {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - GRN Product Add ", message: "Please Add Product and Quentity"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      let grnproduct = new GrnProduct(this.id,this.inndata.product, this.inndata.quentity);

      let tem: GrnProduct[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      this.innerdata = [];
      tem.forEach((t) => this.innerdata.push(t));

      this.innerdata.push(grnproduct);

      this.id++;

      this.innerForm.reset();
      this.isInnerDataUpdated = true;

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
      }
    }

  }

  deleteRow(indata: GrnProduct) {
    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Delete GRN Quentity"})
      .afterClosed().subscribe(res => {
      if (res) {

        const index = datasources.findIndex(item => item.id === indata.id);

        if (index > -1) {
          datasources.splice(index, 1);
        }

        this.innerdata = datasources;
        this.isInnerDataUpdated = true;
      }
      });
    }
    
  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "GRN Quentity Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.grnForm.controls) {
      const control = this.grnForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid GRN Quentity";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - GRN Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.grnForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);


        const grn:Grn = {
          code: this.grnForm.controls['code'].value,
          date: this.grnForm.controls['date'].value,
          time: this.grnForm.controls['time'].value,
          description: this.grnForm.controls['description'].value,
          bagscount: this.grnForm.controls['bagscount'].value,
          railwaystation: this.grnForm.controls['railwaystation'].value,

          grnproducts: this.innerdata,

          grnstatus: {id: parseInt(this.grnForm.controls['grnstatus'].value)},
          employee: {id: parseInt(this.grnForm.controls['employee'].value)},
          // @ts-ignore
          productorder: {id: parseInt(this.grnForm.controls['productorder'].value)},
        }

        //console.log(porder);
        this.currentOperation = "Add GRN ";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.gs.save(grn).subscribe({
              next: () => {
                this.tst.handleResult('success',"GRN Saved Successfully");
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


  update(currentGrn: Grn) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - GRN Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - GRN Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const grn:Grn = {
              code: this.grnForm.controls['code'].value,
              date: this.grnForm.controls['date'].value,
              time: this.grnForm.controls['time'].value,
              description: this.grnForm.controls['description'].value,
              bagscount: this.grnForm.controls['bagscount'].value,
              railwaystation: this.grnForm.controls['railwaystation'].value,

              grnproducts: this.innerdata,

              grnstatus: {id: parseInt(this.grnForm.controls['grnstatus'].value)},
              employee: {id: parseInt(this.grnForm.controls['employee'].value)},
              // @ts-ignore
              productorder: {id: parseInt(this.grnForm.controls['productorder'].value)},
            }

            grn.id = currentGrn.id;

            this.currentOperation = "GRN Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.gs.update(grn).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"GRN Successfully Updated");
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
          data:{heading:"Updates - GRN Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentGrn: Grn) {
    const operation = "Delete GRN ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && currentGrn.id){
        this.gs.delete(currentGrn.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","GRN Successfully Deleted");
            this.clearForm();
          },

          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    });
  }

  clearForm() {
    this.grnForm.reset();
    this.grnForm.controls['employee'].setValue(null);
    this.grnForm.controls['grnstatus'].setValue(null);
    this.grnForm.controls['productorder'].setValue(null);
    this.innerdata = [];

    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const sscode  = this.grnSearchForm.controls['sscode'].value;
    const ssdate  = this.grnSearchForm.controls['ssdate'].value;
    const ssgrnstatus  = this.grnSearchForm.controls['ssgrnstatus'].value;

    let query = ""

    if(ssdate != null && ssdate.trim() !="") query = query + "&date=" + ssdate;
    if(sscode != null && sscode.trim() !="") query = query + "&code=" + sscode;
    if(ssgrnstatus != '') query = query + "&grnstatusid=" + parseInt(ssgrnstatus);

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
        this.grnSearchForm.reset();
        this.grnSearchForm.controls['ssgrnstatus'].setValue('');
        this.loadTable("");
      }
    });
  }

}
