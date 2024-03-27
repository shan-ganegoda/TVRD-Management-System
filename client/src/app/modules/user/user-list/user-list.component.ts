import {Component, OnInit} from '@angular/core';
import {PageErrorComponent} from "../../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../../shared/page-loading/page-loading.component";
import {User} from "../../../core/entity/user";
import {UserStatus} from "../../../core/entity/userstatus";
import {UserType} from "../../../core/entity/usertype";
import {UsersService} from "../../../core/service/user/users.service";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";
import {EmployeeFormComponent} from "../../employees/employee-form/employee-form.component";
import {MatDialog} from "@angular/material/dialog";
import {UserFormComponent} from "../user-form/user-form.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Role} from "../../../core/entity/role";
import {RoleService} from "../../../core/service/user/role.service";
import {UserstatusService} from "../../../core/service/user/userstatus.service";
import {UsertypeService} from "../../../core/service/user/usertype.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {NotificationComponent} from "../../../shared/dialog/notification/notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    PageErrorComponent,
    PageLoadingComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit{

  isFailed = false;
  isLoading = false

  users:User[] = [];
  userstatuses:UserStatus[] = [];
  usertypes:UserType[] = [];
  roles:Role[] = [];

  userSearchForm!: FormGroup;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("User-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("User-Delete");

  constructor(
    private us:UsersService,
    private authorizationService:AuthorizationService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private rs:RoleService,
    private uss:UserstatusService,
    private uts:UsertypeService,
    private snackBar: MatSnackBar
  ) {
    this.userSearchForm = this.fb.group({
      ssfullname:[null,[Validators.required,Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      ssemail:[null,[Validators.required]],
      ssuserstatus:['default',Validators.required],
      ssrole:['default',Validators.required],
    })
  }

  ngOnInit(): void {

    this.initialize();
  }

  initialize(){
    this.loadTable();

    this.rs.getAllRoles().subscribe({
      next:data => this.roles = data,
    });

    this.uss.getAllUserStatuses().subscribe({
      next:data => this.userstatuses = data,
    });

    this.uts.getAllUserTypes().subscribe({
      next:data => this.usertypes = data,
    });

  }

  loadTable(){
    this.us.getAllUsers().subscribe({
      next:data =>{
        this.users = data;
        console.log(this.users)
      }
    });
  }

  showFormDialog(user: User) {
    this.dialog.open(UserFormComponent,{data:user.id})
      .afterClosed().subscribe((refresh:boolean) =>{
      if(refresh) this.loadTable();
    })
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
              this.loadTable();
              this.handleResult('success');
            },

            error: () => {
              this.handleResult('failed');
            }
          });
        } else {
          this.handleResult('failed');
        }
      }
    })
  }

  openFormDialog() {
    this.dialog.open(UserFormComponent)
      .afterClosed().subscribe((refresh:boolean) =>{
      if(refresh) this.loadTable();
    })
  }

  handleSearch() {

  }

  clearSearch() {
    this.dialog.open(WarningDialogComponent,{
      data:{heading:"Clear Search ",message: "Are You Sure You Want To Perform this Operation?"}
    }).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.userSearchForm.reset();
        this.userSearchForm.controls['ssrole'].setValue('default');
        this.userSearchForm.controls['ssuserstatus'].setValue('default');
        this.loadTable();
      }
    });
  }

  handleResult(status:string){

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
