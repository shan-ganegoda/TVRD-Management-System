import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Inventory} from "../../core/entity/inventory";
import {MatTableDataSource} from "@angular/material/table";
import {Vaccination} from "../../core/entity/vaccination";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {Moh} from "../../core/entity/moh";
import {InventoryStatus} from "../../core/entity/inventorystatus";
import {Grn} from "../../core/entity/grn";
import {Employee} from "../../core/entity/employee";
import {ToastService} from "../../core/util/toast/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {MohService} from "../../core/service/moh/moh.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {InventoryService} from "../../core/service/inventory/inventory.service";
import {InventoryserviceService} from "../../core/service/inventory/inventoryservice.service";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {Product} from "../../core/entity/product";
import {VaccinationRecord} from "../../core/entity/vaccinationrecord";
import {InventoryProducts} from "../../core/entity/inventoryproducts";
import {CountByPdh} from "../../core/report/entity/countByPdh";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ProductService} from "../../core/service/productorder/product.service";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-inventory',
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
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit{

  inventoryForm!:FormGroup;
  inventorySearchForm!:FormGroup;

  oldInventory!:Inventory;
  currentInventory!:Inventory;

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  dataSource!: MatTableDataSource<Inventory>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;
  hasWriteAuthority = true;
  hasReadAuthority = true;

  // hasUpdateAuthority = this.am.hasAuthority("Inventory-Update");
  // hasDeleteAuthority = this.am.hasAuthority("Inventory-Delete");
  // hasWriteAuthority = this.am.hasAuthority("Inventory-Write");
  // hasReadAuthority = this.am.hasAuthority("Inventory-Read");

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;


  mohs:Moh[] = [];
  inventorystatues:InventoryStatus[] = [];
  inventorries:Inventory[] = [];
  employees:Employee[] = [];
  products:Product[] = [];

  mpacketcount = 0;
  bpacketcount = 0;

  constructor(
    private am:AuthorizationService,
    private fb:FormBuilder,
    private tst:ToastService,
    private cdr:ChangeDetectorRef,
    private dialog:MatDialog,
    private es: EmployeeService,
    private ms:MohService,
    private rs:RegexService,
    private is:InventoryService,
    private iss:InventoryserviceService,
    private ps: ProductService

  ) {

    this.inventorySearchForm = this.fb.group({
      "ssmoh": new FormControl(''),
      "ssemployee": new FormControl(''),
      "ssinventorystatus": new FormControl(''),
    },{updateOn:'change'});

    this.inventoryForm = this.fb.group({
      "moh": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
      "bagscount": new FormControl('',[Validators.required]),
      "totalpacketcount": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "date": new FormControl('',[Validators.required]),
      "inventorystatus": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});

  }
  ngOnInit(): void {

    this.initialize();

  }

  initialize(){
    this.loadTable("");

    this.ms.getAllMohsList().subscribe({
      next:data => this.mohs =data,
    });

    this.es.getAllEmployeesList("?designationid=1").subscribe({
      next:data => this.employees =data,
    });

    this.iss.getAll().subscribe({
      next:data => this.inventorystatues =data,
    });

    this.ps.getAllProducts().subscribe({
      next:data => this.products =data,
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
    this.is.getAll(query).subscribe({
      next: data => {
        this.inventorries = data;
        this.dataSource = new MatTableDataSource(this.inventorries);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm() {
    this.inventoryForm.controls['moh'].setValidators([Validators.required]);
    this.inventoryForm.controls['date'].setValidators([Validators.required]);
    this.inventoryForm.controls['description'].setValidators([Validators.required]);
    this.inventoryForm.controls['inventorystatus'].setValidators([Validators.required]);
    this.inventoryForm.controls['bagscount'].setValidators([Validators.required]);
    this.inventoryForm.controls['totalpacketcount'].setValidators([Validators.required]);

    Object.values(this.inventoryForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.inventoryForm.controls) {
      const control = this.inventoryForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldInventory != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentInventory[controlName]) {
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

  fillForm(inventory: Inventory) {
    this.enableButtons(false, true, true);

    this.currentInventory = inventory;
    this.oldInventory = this.currentInventory;


    this.inventoryForm.patchValue({
      date: this.currentInventory.date,
      bagscount: this.currentInventory.bagscount,
      totalpacketcount: this.currentInventory.totalpacketcount,
      moh: this.currentInventory.moh?.id,
      employee: this.currentInventory.employee?.id,
      inventorystatus: this.currentInventory.inventorystatus?.id,
      description: this.currentInventory.description,
    });

    this.inventoryForm.markAsPristine();

  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.inventoryForm.controls) {
      const control = this.inventoryForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.inventoryForm.controls) {
      const control = this.inventoryForm.controls[controlName];
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
    //console.log(this.innerdata);

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Inventory Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.inventoryForm.valid) {

        const inventory:Inventory = {
          description: this.inventoryForm.controls['description'].value,
          date: this.inventoryForm.controls['date'].value,
          bagscount: this.inventoryForm.controls['bagscount'].value,
          totalpacketcount: this.inventoryForm.controls['totalpacketcount'].value,

          moh: {id: parseInt(this.inventoryForm.controls['moh'].value)},
          employee: {id: parseInt(this.inventoryForm.controls['employee'].value)},
          inventorystatus: {id: parseInt(this.inventoryForm.controls['inventorystatus'].value)},
        }

        this.currentOperation = "Add Packets";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.is.save(inventory).subscribe({
              next: () => {
                this.tst.handleResult('success',"Inventry Saved Successfully");
                this.loadTable("");
                this.clearForm();
              },
              error: (err: any) => {
                this.tst.handleResult('Failed',err.error.data.message);
              }
            });
            console.log(inventory);
          }
        })
      }

    }

  }

  update(currentInventory: Inventory) {

    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Inventory Update ", message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Inventory Update ", message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {


            const inventory:Inventory = {
              description: this.inventoryForm.controls['description'].value,
              date: this.inventoryForm.controls['date'].value,
              bagscount: this.inventoryForm.controls['bagscount'].value,
              totalpacketcount: this.inventoryForm.controls['totalpacketcount'].value,

              moh: {id: parseInt(this.inventoryForm.controls['moh'].value)},
              employee: {id: parseInt(this.inventoryForm.controls['employee'].value)},
              inventorystatus: {id: parseInt(this.inventoryForm.controls['inventorystatus'].value)},
            }

            inventory.id = currentInventory.id;


            this.currentOperation = "Inventory Update ";

            this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
              .afterClosed().subscribe(res => {
              if (res) {
                this.is.update(inventory).subscribe({
                  next: () => {
                    this.tst.handleResult('success', "Inventory Successfully Updated");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error: (err: any) => {
                    this.tst.handleResult('Failed', err.error.data.message);
                    //console.log(err);
                  }
                });
              }
            });
          }
        });

      } else {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Inventory Update ", message: "No Fields Updated "}
        }).afterClosed().subscribe(res => {
          if (res) {
            return;
          }
        })
      }
    }

  }

  delete(currentInventory: Inventory) {

    const operation = "Delete Inventory ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent, {data: operation})
      .afterClosed().subscribe((res: boolean) => {
      if (res && currentInventory.id) {
        this.is.delete(currentInventory.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success", "Inventory Successfully Deleted");
            this.clearForm();
          },

          error: (err: any) => {
            this.tst.handleResult("Failed", err.error.data.message);
          }
        });
      }
    });

  }

  clearForm() {
    this.inventoryForm.reset();
    this.inventoryForm.controls['employee'].setValue(null);
    this.inventoryForm.controls['moh'].setValue(null);
    this.inventoryForm.controls['inventorystatus'].setValue(null);

    this.enableButtons(true, false, false);
  }

  handleSearch() {
    const ssmoh = this.inventorySearchForm.controls['ssmoh'].value;
    const ssemployee = this.inventorySearchForm.controls['ssemployee'].value;
    const ssinventorystatus = this.inventorySearchForm.controls['ssinventorystatus'].value;


    let query = ""

    if (ssmoh != "") query = query + "&mohid=" + parseInt(ssmoh);
    if (ssemployee != "") query = query + "&employeeid=" + parseInt(ssemployee);
    if (ssinventorystatus != "") query = query + "&inventorystatusid=" + parseInt(ssinventorystatus);


    if (query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent, {data: operation})
      .afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.inventorySearchForm.controls['ssmoh'].setValue('');
        this.inventorySearchForm.controls['ssemployee'].setValue('');
        this.inventorySearchForm.controls['ssinventorystatus'].setValue('');

        this.loadTable("");
      }
    });
  }
}
