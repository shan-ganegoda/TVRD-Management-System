import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {Moh} from "../../core/entity/moh";
import {MohService} from "../../core/service/moh/moh.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Rdh} from "../../core/entity/rdh";
import {MohStatus} from "../../core/entity/mohstatus";
import {RdhService} from "../../core/service/moh/rdh.service";
import {MohstatusService} from "../../core/service/moh/mohstatus.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {Employee} from "../../core/entity/employee";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatRow,
  MatTable,
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {Observable} from "rxjs";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {RegexService} from "../../core/service/regexes/regex.service";
import {ToastService} from "../../core/util/toast/toast.service";
import {AuthorizationService} from "../../core/service/auth/authorization.service";

@Component({
  selector: 'app-mohdetails-list',
  standalone: true,
    imports: [
        PageErrorComponent,
        PageLoadingComponent,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatTable,
        MatTableModule,
        CommonModule,
        MatHeaderRow,
        MatRow,
        MatCell,
        MatHeaderCell,
        MatColumnDef,
        RouterLink,
        MatGridList,
        MatGridTile,
    ],
  templateUrl: './mohdetails.component.html',
})
export class MohdetailsComponent implements OnInit{

  isLoading = false;
  isFailed = false;

  mohSearchForm!:FormGroup;
  mohForm!:FormGroup;

  currentMoh!: Moh;
  oldMoh!:Moh;

  mohs:Moh[] = [];
  districts:Rdh[] = [];
  mohstatuses:MohStatus[] = [];
  employees:Employee[] = [];

  dataSource!: MatTableDataSource<Moh>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  regexes:any;

  currentOperation = '';

  hasUpdateAuthority = this.authorizationService.hasAuthority("MOH-Update");
  hasDeleteAuthority = this.authorizationService.hasAuthority("MOH-Delete");
  hasWriteAuthority = this.authorizationService.hasAuthority("MOH-Write");
  hasReadAuthority = this.authorizationService.hasAuthority("MOH-Read");

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private ms:MohService,
    private ds:RdhService,
    private mss:MohstatusService,
    private es:EmployeeService,
    private fb:FormBuilder,
    private rs:RegexService,
    private dialog:MatDialog,
    private authorizationService:AuthorizationService,
    private cdr:ChangeDetectorRef,
    private tst:ToastService
  ) {
    this.mohSearchForm = this.fb.group({
      ssname:[null,[Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      ssemail:[null],
      ssdistrict:[''],
      ssmohstatus:[''],
    });

    this.mohForm = this.fb.group({
      "name": new FormControl('',[Validators.required]),
      "tele": new FormControl('',[Validators.required]),
      "faxno": new FormControl('',[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "doestablished": new FormControl('',[Validators.required]),
      "mohstatus": new FormControl(null,[Validators.required]),
      "rdh": new FormControl(null,[Validators.required]),
      "employee": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.ds.getAllDistricts().subscribe({
      next:data => this.districts = data,
    });

    this.mss.getAllMohStatuses().subscribe({
      next:data => this.mohstatuses = data,
    });

    this.es.getAllEmployeesList("?designationid=1").subscribe({
      next:data => this.employees = data,
    });

    this.rs.getRegexes('moh').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.ms.getAllMohs(query).subscribe({
      next:data =>{
        this.mohs = data;
        this.dataSource = new MatTableDataSource(this.mohs);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.mohForm.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.mohForm.controls['tele'].setValidators([Validators.required,Validators.pattern(this.regexes['tele']['regex'])]);
    this.mohForm.controls['faxno'].setValidators([Validators.required,Validators.pattern(this.regexes['faxno']['regex'])]);
    this.mohForm.controls['email'].setValidators([Validators.required]);
    this.mohForm.controls['address'].setValidators([Validators.required]);
    this.mohForm.controls['doestablished'].setValidators([Validators.required]);
    this.mohForm.controls['mohstatus'].setValidators([Validators.required]);
    this.mohForm.controls['employee'].setValidators([Validators.required]);
    this.mohForm.controls['rdh'].setValidators([Validators.required]);

    for (const controlName in this.mohForm.controls) {
      const control = this.mohForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldMoh != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentMoh[controlName]) {
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

  fillForm(currentMoh:Moh){

    this.enableButtons(false,true,true);

    this.currentMoh = currentMoh;
    this.oldMoh = this.currentMoh;

    this.mohForm.setValue({
      name: this.currentMoh.name,
      tele: this.currentMoh.tele,
      faxno: this.currentMoh.faxno,
      email: this.currentMoh.email,
      address: this.currentMoh.address,
      doestablished: this.currentMoh.doestablished,
      // toclose: this.currentMoh.toclose,

      rdh: this.currentMoh.rdh?.id,
      mohstatus: this.currentMoh.mohstatus?.id,
      employee: this.currentMoh.employee?.id
    });

    this.mohForm.markAsPristine();

    //this.currentOperation = 'Update'+ " '" + this.currentMoh.name + "'" + this.getUpdates();

  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.mohForm.controls) {
      const control = this.mohForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.mohForm.controls){
      const control = this.mohForm.controls[controlName];
      if(control.errors){
        if(this.regexes[controlName] != undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - MOH Add ",message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.mohForm.valid){
        this.es.getEmployeeById(parseInt(this.mohForm.controls["employee"].value)).subscribe({
          next:data =>{
            const employee = data;

            const moh:Moh = {
              name: this.mohForm.controls['name'].value,
              email: this.mohForm.controls['email'].value,
              tele: this.mohForm.controls['tele'].value,
              faxno: this.mohForm.controls['faxno'].value,
              address: this.mohForm.controls['address'].value,
              doestablished: this.mohForm.controls['doestablished'].value,

              rdh: {id: parseInt(this.mohForm.controls['rdh'].value)},
              mohstatus: {id: parseInt(this.mohForm.controls['mohstatus'].value)},
              employee: employee,
            }

            console.log(moh);

            this.currentOperation = "Add MOH " +moh.name;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.ms.saveMoh(moh).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"MOH Saved Successfully");
                    this.loadTable("");
                    this.clearForm();
                    },
                  error:(err:any) => {
                    this.tst.handleResult('Failed',err.error.data.message);
                  }
                });
              }
            })
          }
        });

      }
    }
  }

  update(currentmoh:Moh){
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - MOH Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - MOH Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            if(this.mohForm.valid){
              this.es.getEmployeeById(parseInt(this.mohForm.controls["employee"].value)).subscribe({
                next:data =>{
                  const employee = data;

                  const moh:Moh = {
                    name: this.mohForm.controls['name'].value,
                    email: this.mohForm.controls['email'].value,
                    tele: this.mohForm.controls['tele'].value,
                    faxno: this.mohForm.controls['faxno'].value,
                    address: this.mohForm.controls['address'].value,
                    doestablished: this.mohForm.controls['doestablished'].value,

                    rdh: {id: parseInt(this.mohForm.controls['rdh'].value)},
                    mohstatus: {id: parseInt(this.mohForm.controls['mohstatus'].value)},
                    employee: employee,
                  }

                  moh.id = currentmoh.id;

                  console.log(moh);

                  this.currentOperation = "Update MOH " + currentmoh.name;

                  this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
                    .afterClosed().subscribe(res => {
                    if(res) {
                      this.ms.updateMoh(moh).subscribe({
                        next:() => {
                          this.tst.handleResult('success',"MOH Updated Successfully");
                          this.loadTable("");
                          this.clearForm();
                          },
                        error:(err:any) => {
                          this.tst.handleResult('Failed',err.error.data.message);
                        }
                      });
                    }
                  })
                }
              });

            }

          }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - MOH Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  deleteUser(moh: Moh) {

    const operation = "Delete MOH " + moh.name;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (moh.id) {
          this.ms.deleteMoh(moh.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success',"MOH Deleted Successfully");
              this.clearForm();
            },
            error: (err:any) => {
              this.tst.handleResult('Failed',err.error.data.message);
              console.log(err);
            },
          });
        }
      }
    })
  }

  clearForm() {
    this.mohForm.reset();
    this.mohForm.controls['employee'].setValue(null);
    this.mohForm.controls['mohstatus'].setValue(null);
    this.mohForm.controls['rdh'].setValue(null);

    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssname  = this.mohSearchForm.controls['ssname'].value;
    const ssemail  = this.mohSearchForm.controls['ssemail'].value;
    const ssdistrict  = this.mohSearchForm.controls['ssdistrict'].value;
    const ssmohstatus  = this.mohSearchForm.controls['ssmohstatus'].value;

    let query = ""

    if(ssname != null && ssname.trim() !="") query = query + "&name=" + ssname;
    if(ssemail != null && ssemail.trim() !="") query = query + "&email=" + ssemail;
    if(ssdistrict != '') query = query + "&districtid=" + parseInt(ssdistrict);
    if(ssmohstatus != '') query = query + "&mohstatusid=" + parseInt(ssmohstatus);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"}
    ).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.mohSearchForm.reset();
        this.mohSearchForm.controls['ssdistrict'].setValue('');
        this.mohSearchForm.controls['ssmohstatus'].setValue('');
        this.loadTable("");
      }
    });
  }

}
