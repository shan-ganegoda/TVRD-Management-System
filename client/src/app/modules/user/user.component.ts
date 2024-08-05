import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {User} from "../../core/entity/user";
import {UserStatus} from "../../core/entity/userstatus";
import {UserType} from "../../core/entity/usertype";
import {UsersService} from "../../core/service/user/users.service";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Role} from "../../core/entity/role";
import {RoleService} from "../../core/service/user/role.service";
import {UserstatusService} from "../../core/service/user/userstatus.service";
import {UsertypeService} from "../../core/service/user/usertype.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Employee} from "../../core/entity/employee";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {Input} from "postcss";
import {RegexService} from "../../core/service/regexes/regex.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {RouterLink} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Moh} from "../../core/entity/moh";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AsyncPipe} from "@angular/common";
import {ToastService} from "../../core/util/toast/toast.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    PageErrorComponent,
    PageLoadingComponent,
    FormsModule,
    ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    MatSelectionList,
    MatListOption,
    RouterLink,
    MatPaginator,
    AsyncPipe
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit{

  isFailed = false;
  isLoading = false

  users:User[] = [];
  userstatuses:UserStatus[] = [];
  usertypes:UserType[] = [];
  roles:Role[] = [];
  employees:Employee[] = [];

  userRoleList:Role[] = [];

  userSearchForm!: FormGroup;
  userForm!: FormGroup;

  regexes:any;

  user!:User;
  oldUser!:User;
  employee!:Employee;

  currentOperation = '';

  dataSource!: MatTableDataSource<User>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("User-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("User-Delete");
  protected hasWriteAuthority = this.authorizationService.hasAuthority("User-Write");
  protected hasReadAuthority = this.authorizationService.hasAuthority("User-Read");

  constructor(
    private us:UsersService,
    private authorizationService:AuthorizationService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private rs:RoleService,
    private es:EmployeeService,
    private uss:UserstatusService,
    private uts:UsertypeService,
    private tst: ToastService,
    private rxs:RegexService,
    private cdr:ChangeDetectorRef
  ) {
    this.userSearchForm = this.fb.group({
      ssfullname:[null,[Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      ssemail:[null],
      ssuserstatus:['default',Validators.required],
      ssrole:['default',Validators.required],
    });

    this.userForm = this.fb.group({
      "employee": new FormControl(null,[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "password": new FormControl('',[Validators.required]),
      "usertype": new FormControl(null,[Validators.required]),
      "userstatus": new FormControl(null,[Validators.required]),
      "role": new FormControl(null),
      "userroles": new FormControl(null),
      "description": new FormControl('',[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.loadTable("");

    this.rs.getAllRoles().subscribe({
      next:data => this.roles = data,
    });

    this.uss.getAllUserStatuses().subscribe({
      next:data => this.userstatuses = data,
    });

    this.uts.getAllUserTypes().subscribe({
      next:data => this.usertypes = data,
    });

    this.es.getAllEmployees("").subscribe({
      next:data => this.employees = data,
    });

    this.rxs.getRegexes('user').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

  }

  loadTable(query:string){
    this.us.getAllUsers(query).subscribe({
      next:data =>{
        this.users = data;
        this.dataSource = new MatTableDataSource(this.users);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.userForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.userForm.controls['password'].setValidators([Validators.required,Validators.pattern(this.regexes['password']['regex'])]);
    this.userForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.userForm.controls['usertype'].setValidators([Validators.required]);
    this.userForm.controls['userstatus'].setValidators([Validators.required]);
    this.userForm.controls['employee'].setValidators([Validators.required]);
    //Object.values(this.userForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.userForm.controls) {
      const control = this.userForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldUser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.user[controlName]) {
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

  fillForm(user:User){

    this.enableButtons(false,true,true);

    this.user = user;
    this.oldUser = this.user;

    this.userForm.setValue({
      email: this.user.email,
      password: this.user.password,
      description: this.user.description,
      usertype: this.user.usertype.id,
      userstatus: this.user.userstatus.id,
      employee: this.user.employee.id,
      role: null,
      userroles: null
    });

    this.userForm.get('employee')?.disable();

    this.userRoleList = this.user.roles;
    this.userForm.markAsPristine();

    //this.currentOperation = 'Update'+ " '" + this.user.employee.callingname + "'" + this.getUpdates();
  }

  addRoleToList(){
    const roleId = this.userForm.controls['role'].value;

    if(roleId == null){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Role Add ",message: "Select a Role<br> "}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{
      const role = this.roles.filter(r =>  r.id === parseInt(roleId))[0];

      if (!this.userRoleList.some(r => r.name === role.name)) {
        this.userRoleList = [...this.userRoleList, role];
      }

      this.userForm.controls["userroles"].clearValidators();
      this.userForm.controls["userroles"].updateValueAndValidity();

      this.userForm.controls['role'].reset();
    }

    //this.userForm.controls['role'].setValue(null);

  }
  removeFromRoleList(id:number | undefined) {
    this.userRoleList = this.userRoleList.filter(r => r.id !== id);
    this.userForm.controls["userroles"].updateValueAndValidity();
  }

  filterEmployee(event:any){
    let employeeid = event.target.value;
    this.es.getEmployeeById(parseInt(employeeid)).subscribe({
      next: data => {
        const email = data.email;
        this.userForm.controls['email'].setValue(email);
      }
    });
  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.userForm.controls) {
      const control = this.userForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.userForm.controls){
      const control = this.userForm.controls[controlName];
      if(control.errors){
        if(this.regexes[controlName] != undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if(this.userRoleList.length == 0 ){
      errors = errors + "<br>Invalid User Roles";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(this.userForm.controls["password"].value == "") errors = errors + "Password Invalid";

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - User Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.userForm.valid){
        this.es.getEmployeeById(parseInt(this.userForm.controls["employee"].value)).subscribe({
          next:data =>{
            const employee = data;

            const user:User = {
              email: this.userForm.controls['email'].value,
              password: this.userForm.controls['password'].value,

              usertype: {id: parseInt(this.userForm.controls['usertype'].value)},
              userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
              description: this.userForm.controls['description'].value,
              employee: employee,
              roles: this.userRoleList,
            }

            this.currentOperation = "Add User " +user.email;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.us.saveUser(user).subscribe({
                  next:() => {
                    this.tst.handleResult('success'," User Added Successfully");
                    this.loadTable("");
                    this.clearForm();
                    },
                  error:(err:any) => {
                    // console.log(err.error.data.message);
                    this.tst.handleResult('failed',err.error.data.message);
                  }
                });
              }
            })
          }
        });

      }
    }
  }

  update(currentuser:User){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - User Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates !=""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - User Update ",message: "You Have Following Updates \n " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            if(this.userForm.valid){
              this.es.getEmployeeById(parseInt(this.userForm.controls["employee"].value)).subscribe({
                next:data =>{
                  const employee = data;

                  const user:User = {
                    email: this.userForm.controls['email'].value,
                    password: this.userForm.controls['password'].value,

                    usertype: {id: parseInt(this.userForm.controls['usertype'].value)},
                    userstatus: {id: parseInt(this.userForm.controls['userstatus'].value)},
                    description: this.userForm.controls['description'].value,
                    employee: employee,
                    roles: this.userRoleList,
                  }

                  user.id = currentuser.id;

                  this.currentOperation = "Update User " +user.email;

                  this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
                    .afterClosed().subscribe(res => {
                    if(res) {
                      this.us.updateUser(user).subscribe({
                        next:() => {
                          this.tst.handleResult('success'," User Updated Successfully");
                          this.loadTable("");
                          this.clearForm();
                          },
                        error:(err:any) => {
                          this.tst.handleResult('failed',err.error.data.message);
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
          data:{heading:"Updates - User Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }


  }

  deleteUser(user: User) {
    const operation = "Delete User " + user.employee.callingname;
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (user.id) {
          this.us.deleteUser(user.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success'," User Deleted Successfully");
              this.clearForm();
            },

            error: (err:any) => {
              this.tst.handleResult('failed',err.error.data.message);
            }
          });
        }
      }
    })
  }

  clearForm() {
    this.userForm.reset();
    this.userForm.controls['usertype'].setValue(null);
    this.userForm.controls['userstatus'].setValue(null);
    this.userForm.controls['employee'].setValue(null);
    this.userRoleList.splice(0,this.userRoleList.length);

    this.enableButtons(true,false,false);

    this.userForm.get('email')?.enable();
    this.userForm.get('employee')?.enable();

  }

  handleSearch() {
    const ssfullname  = this.userSearchForm.controls['ssfullname'].value;
    const ssemail  = this.userSearchForm.controls['ssemail'].value;
    const ssrole  = this.userSearchForm.controls['ssrole'].value;
    const ssuserstatus  = this.userSearchForm.controls['ssuserstatus'].value;

    let query = ""

    if(ssfullname != null && ssfullname.trim() !="") query = query + "&fullname=" + ssfullname;
    if(ssemail != null && ssemail.trim() !="") query = query + "&email=" + ssemail;
    if(ssrole != 'default') query = query + "&roleid=" + parseInt(ssrole);
    if(ssuserstatus != 'default') query = query + "&userstatusid=" + parseInt(ssuserstatus);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"})
      .afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.userSearchForm.reset();
        this.userSearchForm.controls['ssrole'].setValue('default');
        this.userSearchForm.controls['ssuserstatus'].setValue('default');
        this.loadTable("");
      }
    });
  }

  resetPassword() {
    let employeeid = this.userForm.controls['employee'].value;
    if(employeeid != null){
      this.es.getEmployeeById(parseInt(employeeid)).subscribe({
        next: data => {
          const nic = data.nic;
          const resetVal = `Pr@${nic}`;
          this.userForm.controls['password'].setValue(resetVal);
        }
      });
    }else{
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - User Password Reset ", message: "Please Select Employee First"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    }

  }
}
