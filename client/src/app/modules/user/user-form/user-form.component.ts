import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PageLoadingComponent} from "../../../shared/page-loading/page-loading.component";
import {Employee} from "../../../core/entity/employee";
import {Role} from "../../../core/entity/role";
import {UserStatus} from "../../../core/entity/userstatus";
import {UserType} from "../../../core/entity/usertype";
import {User} from "../../../core/entity/user";
import {TextFieldModule} from "@angular/cdk/text-field";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {UsersService} from "../../../core/service/user/users.service";
import {UserstatusService} from "../../../core/service/user/userstatus.service";
import {UsertypeService} from "../../../core/service/user/usertype.service";
import {RoleService} from "../../../core/service/user/role.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {NotificationComponent} from "../../../shared/dialog/notification/notification.component";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    MatDialogClose,
    ReactiveFormsModule,
    PageLoadingComponent,
    TextFieldModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{

  isLoading = false;

  userForm!:FormGroup;
  roleForm!:FormGroup;



  employees:Employee[] = [];
  roles:Role[] = [];
  userstatuses:UserStatus[] = [];
  usertypes:UserType[] = [];

  userRoleList:Role[] = [];

  user!:User;
  oldUser!:User;
  employee!:Employee;

  isUpdateOperation = false;
  isAddOperation = false;

  regexes:any;

  currentOperation = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private userid:number,
    private es:EmployeeService,
    private us:UsersService,
    private uss:UserstatusService,
    private uts:UsertypeService,
    private rs:RoleService,
    private dialog:MatDialog,
    private dialogRef:MatDialogRef<UserFormComponent>,
    private snackBar:MatSnackBar,
    private fb:FormBuilder,
    private rxs:RegexService
  ) {
    this.userForm = this.fb.group({
      "email": new FormControl('',[Validators.required]),
      "password": new FormControl(''),
      // "description": new FormControl('',[Validators.required]),
      "usertype": new FormControl('default',[Validators.required]),
      "userstatus": new FormControl('default',[Validators.required]),
      "employee": new FormControl('default',[Validators.required]),
    },{updateOn:'change'});

    this.roleForm = this.fb.group({
      "role": new FormControl('default',[Validators.required])
    },{updateOn:'change'});
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.initialize();
  }

  initialize(){

    this.es.getAllEmployees("").subscribe({
      next:data => this.employees = data,
      //error: () => this.handleResult('failed')
    });

    this.rs.getAllRoles().subscribe({
      next:data => this.roles = data,
      //error: () => this.handleResult('failed')
    });

    this.uss.getAllUserStatuses().subscribe({
      next:data => this.userstatuses = data,
      //error: () => this.handleResult('failed')
    });

    this.uts.getAllUserTypes().subscribe({
      next:data => this.usertypes = data,
      //error: () => this.handleResult('failed')
    });

    this.rxs.getRegexes('user').subscribe({
      next:data => this.regexes = data,
      error: () => this.regexes = [] || undefined
    });

    if(this.userid){
      this.us.getUserById(this.userid).subscribe({

        next:data => {
          this.user = data;
          //console.log(this.currentEmployee);
          this.fillForm();
          this.isLoading = false;
        },

        //error:() => this.handleResult('failed')
      });
    }else{
      this.currentOperation = 'Add Employee';
      this.isAddOperation = true;
      this.isUpdateOperation = false;
      this.isLoading = false;
    }

    this.createForm();
  }

  createForm(){
    this.userForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.userForm.controls['password'].setValidators([Validators.pattern(this.regexes['password']['regex'])]);
    //this.userForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.userForm.controls['usertype'].setValidators([Validators.required]);
    this.userForm.controls['userstatus'].setValidators([Validators.required]);
    this.userForm.controls['employee'].setValidators([Validators.required]);

    for (const controlName in this.userForm.controls) {
      const control = this.userForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldUser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentEmployee[controlName]) {
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
  }

  fillForm(){
    this.oldUser = this.user;

    this.userForm.setValue({
      email: this.user.email,
      password: this.user.password,
      //description: this.user.description,
      usertype: this.user.usertype.id,
      userstatus: this.user.userstatus.id,
      employee: this.user.employee.id
    });

    this.userRoleList = this.user.roles;

    this.currentOperation = 'Update'+ " '" + this.user.employee.callingname + "'" + this.getUpdates();
    this.isUpdateOperation= true;
    this.isAddOperation = false;
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
              employee: employee,
              roles: this.userRoleList,
            }

            this.currentOperation += " " +user.email;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.us.saveUser(user).subscribe({
                  next:() => { this.handleResult('success'); },
                  error:(err:any) => {
                    this.handleResult('failed');
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
                    employee: employee,
                    roles: this.userRoleList,
                  }

                  user.id = currentuser.id;

                  this.currentOperation += " " +user.email;

                  this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
                    .afterClosed().subscribe(res => {
                    if(res) {
                      this.us.updateUser(user).subscribe({
                        next:() => { this.handleResult('success'); },
                        error:(err:any) => {
                          this.handleResult('failed');
                        }
                      });
                    }
                  })
                }
              });

            }

          }
        });

      }
    }


  }

  clearForm() {

  }

  addRoleToList() {
    const roleId = this.roleForm.controls['role'].value;

    if (this.roleForm.valid) {
      const role = this.roles.filter(r =>  r.id === parseInt(roleId))[0];

      if (!this.userRoleList.some(r => r.name === role.name)) {
        this.userRoleList = [...this.userRoleList, role];
      }
    }
  }

  removeFromRoleList(id:number) {
    this.userRoleList = this.userRoleList.filter(r => r.id !== id);
  }

  handleResult(status:string){

    this.dialogRef.close(true);

    if(status === "success"){
      this.snackBar.openFromComponent(NotificationComponent,{
        data:{ message: status,icon: "done_all" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    }else{
      this.snackBar.openFromComponent(NotificationComponent,{
        data:{ message: status,icon: "report" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['failure-snackbar'],
      });
    }
  }
}
