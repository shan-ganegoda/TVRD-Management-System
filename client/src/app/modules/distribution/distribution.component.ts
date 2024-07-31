import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {Product} from "../../core/entity/product";
import {DistributionProductStatus} from "../../core/entity/distributionproductstatus";
import {Mother} from "../../core/entity/mother";
import {Clinic} from "../../core/entity/clinic";
import {Distribution} from "../../core/entity/distribution";
import {DistributionProduct} from "../../core/entity/distributionproduct";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/util/toast/toast.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {MotherService} from "../../core/service/motherregistration/mother.service";
import {DistributionService} from "../../core/service/distribution/distribution.service";
import {ProductService} from "../../core/service/productorder/product.service";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {DistributionproductstatusService} from "../../core/service/distribution/distributionproductstatus.service";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-distribution',
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
  templateUrl: './distribution.component.html',
  styleUrl: './distribution.component.scss'
})
export class DistributionComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  inndata!: any;
  oldInndata!: any;

  dataSource!: MatTableDataSource<Distribution>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products:Product[] = [];
  dpstatuses:DistributionProductStatus[] = [];
  mothers:Mother[] = [];
  clinics:Clinic[] = [];
  distributions:Distribution[] = [];
  innerdata: DistributionProduct[] = [];

  currentDistribution!:Distribution;
  oldDistribution!:Distribution;

  isInnerDataUpdated:boolean = false;

  innerForm!: FormGroup;
  distributionForm!: FormGroup;
  distributionSearchForm!: FormGroup;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Distribution-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Distribution-Delete"); //need to be false
  protected hasWriteAuthority = this.authorizationService.hasAuthority("Distribution-Write");

  constructor(
              private authorizationService:AuthorizationService,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private rs: RegexService,
              private cs:ClinicService,
              private ms:MotherService,
              private ds:DistributionService,
              private ps:ProductService,
              private dpss:DistributionproductstatusService,
              private dialog: MatDialog,
              private tst:ToastService,
  ) {

    this.distributionSearchForm = this.fb.group({
      "ssmother": new FormControl(''),
      "ssclinic": new FormControl(''),
      "ssproduct": new FormControl(''),
    },{updateOn: 'change'});

    this.distributionForm = this.fb.group({
      "description": new FormControl('', [Validators.required]),
      "lastupdated": new FormControl('', [Validators.required]),
      "clinic": new FormControl(null, [Validators.required]),
      "mother": new FormControl(null, [Validators.required]),
    }, {updateOn: 'change'});

    this.innerForm = this.fb.group({
      "quentity": new FormControl(''),
      "date": new FormControl(''),
      "product": new FormControl(null),
      "distributionproductstatus": new FormControl(null),
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.cs.getAllList().subscribe({
      next:data => this.clinics = data,
    });

    this.ms.getAll("").subscribe({
      next:data => this.mothers = data,
    });

    this.ps.getAllProducts().subscribe({
      next:data => this.products = data,
    });

    this.dpss.getAll().subscribe({
      next:data => this.dpstatuses = data,
    });

    this.rs.getRegexes('distribution').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.ds.getAll(query).subscribe({
      next: data => {
        this.distributions = data
        this.dataSource = new MatTableDataSource(this.distributions);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
        // console.log(query);
      }
    });
  }

  createForm(){
    this.distributionForm.controls['lastupdated'].setValidators([Validators.required]);
    this.distributionForm.controls['clinic'].setValidators([Validators.required]);
    this.distributionForm.controls['description'].setValidators([Validators.required]);
    this.distributionForm.controls['mother'].setValidators([Validators.required]);

    this.innerForm.controls['quentity'].setValidators([Validators.required]);
    this.innerForm.controls['product'].setValidators([Validators.required]);
    this.innerForm.controls['date'].setValidators([Validators.required]);

    Object.values(this.distributionForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.distributionForm.controls) {
      const control = this.distributionForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldDistribution != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentDistribution[controlName]) {
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

  fillForm(distribution: Distribution) {
    this.enableButtons(false, true, true);

    this.currentDistribution = distribution;
    this.oldDistribution = this.currentDistribution;

    this.innerdata = this.currentDistribution.distributionproducts;


    this.distributionForm.patchValue({
      lastupdated: this.currentDistribution.lastupdated,
      clinic: this.currentDistribution.clinic.id,
      mother: this.currentDistribution.mother.id,
      description: this.currentDistribution.description,
    })

    //this.porderForm.patchValue(this.productOrder);

    this.distributionForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }

  }

  id= 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.product == null || this.inndata.quentity == "" || this.inndata.distributionproductstatus == null || this.inndata.date == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Distribution Product Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      let dis = new DistributionProduct(this.id,this.inndata.product, this.inndata.quentity,this.inndata.date,this.inndata.distributionproductstatus);

      let tem: DistributionProduct[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      this.innerdata = [];
      tem.forEach((t) => this.innerdata.push(t));

      this.innerdata.push(dis);

      this.id++;

      this.isInnerDataUpdated = true;
      this.innerForm.reset();

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
      }
    }

  }

  deleteRow(indata: DistributionProduct) {
    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Distribution Details"})
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
    for (const controlName in this.distributionForm.controls) {
      const control = this.distributionForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if(this.isInnerDataUpdated){
      updates = updates + "<br>" + "Distribution Product Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.distributionForm.controls) {
      const control = this.distributionForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Distribution Products";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();
    //console.log(this.innerdata);

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Distribution Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.distributionForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i)=> delete i.id);


        const distribution:Distribution = {
          lastupdated: this.distributionForm.controls['lastupdated'].value,
          description: this.distributionForm.controls['description'].value,

          distributionproducts: this.innerdata,

          clinic: {id: parseInt(this.distributionForm.controls['clinic'].value)},
          mother: {id: parseInt(this.distributionForm.controls['mother'].value)},
        }

        //console.log(porder);
        this.currentOperation = "Add Distribution ";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.ds.save(distribution).subscribe({
              next: () => {
                this.tst.handleResult('success',"Distribution Saved Successfully");
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

  update(currentDistribution: Distribution) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Destribution Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Distribution Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            // @ts-ignore
            this.innerdata.forEach((i)=> delete i.id);

            const distribution:Distribution = {
              lastupdated: this.distributionForm.controls['lastupdated'].value,
              description: this.distributionForm.controls['description'].value,

              distributionproducts: this.innerdata,

              clinic: {id: parseInt(this.distributionForm.controls['clinic'].value)},
              mother: {id: parseInt(this.distributionForm.controls['mother'].value)},
            }

            distribution.id = currentDistribution.id;

            console.log(distribution);

            this.currentOperation = "Distribution Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.ds.update(distribution).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Distribution Successfully Updated");
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
          data:{heading:"Updates - Distribution Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentDistribution: Distribution) {
    const operation = "Delete Distribution ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && currentDistribution.id){
        this.ds.delete(currentDistribution.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Distribution Successfully Deleted");
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
    this.distributionForm.reset();
    this.distributionForm.controls['clinic'].setValue(null);
    this.distributionForm.controls['mother'].setValue(null);
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true,false,false);
  }


  handleSearch() {
    const ssclinic  = this.distributionSearchForm.controls['ssclinic'].value;
    const ssmother  = this.distributionSearchForm.controls['ssmother'].value;
    const ssproduct  = this.distributionSearchForm.controls['ssproduct'].value;

    let query = ""

    if(ssclinic != "") query = query + "&clinicid=" + parseInt(ssclinic);
    if(ssmother != "") query = query + "&motherid=" + parseInt(ssmother);
    if(ssproduct != "") query = query + "&productid=" + parseInt(ssproduct);

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
        this.distributionSearchForm.controls['ssclinic'].setValue('');
        this.distributionSearchForm.controls['ssmother'].setValue('');
        this.distributionSearchForm.controls['ssproduct'].setValue('');
        this.loadTable("");
      }
    });
  }


}
