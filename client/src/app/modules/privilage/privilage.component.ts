import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Mother} from "../../core/entity/mother";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {Authority} from "../../core/entity/authority";
import {Module} from "../../core/entity/module";
import {Operation} from "../../core/entity/operation";
import {Role} from "../../core/entity/role";
import {AuthorityService} from "../../core/service/authority/authority.service";
import {OperationService} from "../../core/service/authority/operation.service";
import {ModuleService} from "../../core/service/authority/module.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {RoleService} from "../../core/service/user/role.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {ToastService} from "../../core/util/toast/toast.service";

@Component({
  selector: 'app-privilage',
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
  templateUrl: './privilage.component.html',
  styleUrl: './privilage.component.scss'
})
export class PrivilageComponent implements OnInit{

  privilegeSearchForm!:FormGroup;
  privilegeForm!:FormGroup;

  isLoading = false;
  isFailed = false;

  dataSource!: MatTableDataSource<Authority>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  authorities:Authority[] = [];
  modules:Module[] = [];
  operations:Operation[] = [];
  roles:Role[] = [];

  regexes:any;

  currentAuthority!:Authority;
  oldAuthority!:Authority;

  currentOperation = '';

  hasUpdateAuthority = true;
  hasDeleteAuthority = true;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
              private fb:FormBuilder,
              private as:AuthorityService,
              private os:OperationService,
              private ms:ModuleService,
              private rs:RoleService,
              private dialog:MatDialog,
              private tst:ToastService,
              private cdr:ChangeDetectorRef,
  ) {
    this.privilegeSearchForm = this.fb.group({
      "ssmodule": new FormControl(""),
      "ssoperation": new FormControl(""),
      "ssrole": new FormControl(""),
    },{updateOn:"change"});

    this.privilegeForm = this.fb.group({
      "module": new FormControl(null,[Validators.required]),
      "operation": new FormControl(null,[Validators.required]),
      "role": new FormControl(null,[Validators.required]),
    },{updateOn:"change"});
  }

  ngOnInit() {
    this.initialized();
  }

  initialized(){
    this.loadTable("");
    this.createForm();

    this.ms.getAll().subscribe({
      next: data => this.modules = data,
    });

    this.os.getAll().subscribe({
      next: data => this.operations = data,
    });

    this.rs.getAllRoles().subscribe({
      next: data => this.roles = data,
    });
  }

  loadTable(query:string){
    this.as.getAll(query).subscribe({
      next:data =>{
        this.authorities = data;
        this.dataSource = new MatTableDataSource(this.authorities);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.privilegeForm.controls['module'].setValidators([Validators.required]);
    this.privilegeForm.controls['role'].setValidators([Validators.required]);
    this.privilegeForm.controls['operation'].setValidators([Validators.required]);

    for (const controlName in this.privilegeForm.controls) {
      const control = this.privilegeForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldAuthority != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentAuthority[controlName]) {
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

  fillForm(authority: Authority) {
    this.enableButtons(false,true,true);

    this.currentAuthority = authority;
    this.oldAuthority = this.currentAuthority;

    this.privilegeForm.setValue({
      role: this.currentAuthority.role?.id,
      module: this.currentAuthority.module?.id,
      operation: this.currentAuthority.operation?.id,

    });

    this.privilegeForm.markAsPristine();
  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.privilegeForm.controls) {
      const control = this.privilegeForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.privilegeForm.controls){
      const control = this.privilegeForm.controls[controlName];
      if(control.errors){
          errors = errors + "<br>Invalid " + controlName;
      }
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Privilege Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.privilegeForm.valid){

        const authority:Authority = {
          role: {id: parseInt(this.privilegeForm.controls['role'].value),name:''},
          module: {id: parseInt(this.privilegeForm.controls['module'].value)},
          operation: {id: parseInt(this.privilegeForm.controls['operation'].value)},
        }

        this.currentOperation = "Add Privilage ";

        this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
          .afterClosed().subscribe(res => {
          if(res) {
            this.as.save(authority).subscribe({
              next:() => {
                this.tst.handleResult('success',"Add Privilege Succssfully");
                this.loadTable("");
                this.clearForm();
              },
              error:(err:any) => {
                this.tst.handleResult('Failed',err.error.data.message);
              }
            });
          }
        });
      }
    }
  }

  update(currentAuthority: Authority) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Privilege Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Privilege Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const authority:Authority = {
              role: {id: parseInt(this.privilegeForm.controls['role'].value),name:''},
              module: {id: parseInt(this.privilegeForm.controls['module'].value)},
              operation: {id: parseInt(this.privilegeForm.controls['operation'].value)},
            }

            authority.id = currentAuthority.id;

            this.currentOperation = "Update Privilege ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.as.update(authority).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Privilege Updated Successfully");
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

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Privilege Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentAuthority: Authority) {
    const operation = "Delete Privilege ";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (currentAuthority.id) {
          this.as.delete(currentAuthority.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success',"Privilege Deleted Successfully");
              this.clearForm();
            },
            error: (err:any) => {
              console.log(err);
              this.tst.handleResult('Failed',err.error.data.message);
            },
          });
        } else {
          this.tst.handleResult('Failed'," Id Not Found");
        }
      }
    });
  }

  clearForm() {
    this.privilegeForm.controls['role'].setValue(null);
    this.privilegeForm.controls['module'].setValue(null);
    this.privilegeForm.controls['operation'].setValue(null);

    this.enableButtons(true,false,false);
  }

  handleSearch() {
    const ssmodule  = this.privilegeSearchForm.controls['ssmodule'].value;
    const ssrole  = this.privilegeSearchForm.controls['ssrole'].value;
    const ssoperation  = this.privilegeSearchForm.controls['ssoperation'].value;

    let query = ""

    if(ssmodule != '') query = query + "&moduleid=" + parseInt(ssmodule);
    if(ssrole != '') query = query + "&roleid=" + parseInt(ssrole);
    if(ssoperation != '') query = query + "&operationid=" + parseInt(ssoperation);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"}
    ).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.privilegeSearchForm.controls['ssmodule'].setValue('');
        this.privilegeSearchForm.controls['ssoperation'].setValue('');
        this.privilegeSearchForm.controls['ssrole'].setValue('');
        this.loadTable("");
      }
    });
  }

}
