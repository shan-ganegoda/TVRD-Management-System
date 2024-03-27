import {Component, OnInit} from '@angular/core';
import {Employee} from "../../../core/entity/employee";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeFormComponent} from "../employee-form/employee-form.component";
import {PageLoadingComponent} from "../../../shared/page-loading/page-loading.component";
import {PageErrorComponent} from "../../../shared/page-error/page-error.component";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GenderService} from "../../../core/service/employee/gender.service";
import {Gender} from "../../../core/entity/gender";
import {DesignationService} from "../../../core/service/employee/designation.service";
import {Designation} from "../../../core/entity/designation";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {getLocaleFirstDayOfWeek} from "@angular/common";
import {NotificationComponent} from "../../../shared/dialog/notification/notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";
import {AuthorizationService} from "../../../core/service/auth/authorization.service";



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    PageLoadingComponent,
    PageErrorComponent,
    MatGridListModule,
    ReactiveFormsModule
  ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit{

  isFailed = false;
  isLoading = false;

  employees: Employee[] = [];
  genders: Gender[] = [];
  designations: Designation[] = [];

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Employee-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Employee-Delete"); //need to be false

  employeeSearchForm:FormGroup;

  constructor(
              private dialog:MatDialog,
              private employeeService:EmployeeService,
              private gs:GenderService,
              private ds:DesignationService,
              private fb:FormBuilder,
              private snackBar:MatSnackBar,
              private authorizationService:AuthorizationService
  ) {

    this.employeeSearchForm = this.fb.group({
      ssfullname:[null,[Validators.required,Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      ssnumber:[null,[Validators.required,Validators.pattern(/^E[0-9]{3}$/)]],
      ssgender:['default',Validators.required],
      ssdesignation:['default',Validators.required],
    })
  }

  ngOnInit(): void {
    this.initialize();

  }

  initialize(){

    this.loadTable("");

    this.gs.getGenderList().subscribe({
      next:data => this.genders = data,
      // error: () => this.handleResult('failed')
    });

    this.ds.getAllDesignations().subscribe({
      next:data => this.designations = data,
      //error: () => this.handleResult('failed')
    });
  }

  loadTable(query:string){
    this.employeeService.getAllEmployees(query).subscribe({
      next:data =>{
        this.employees = data;
      }
    })
  }


  showFormDialog(employee:Employee){
    this.dialog.open(EmployeeFormComponent,{data:employee.id})
      .afterClosed().subscribe((refresh:boolean) =>{
        if(refresh) this.loadTable("");

    })
  }

  openFormDialog(){
    this.dialog.open(EmployeeFormComponent)
      .afterClosed().subscribe((refresh:boolean) =>{
        if(refresh) this.loadTable("");
    })
  }

  deleteEmployee(employee:Employee){

    const operation = "Delete Employee " + employee.callingname +" ("+ employee.number +") ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
        if(res){
          this.employeeService.deleteEmployeeByNumber(employee.number).subscribe({
            next: () => {
              this.loadTable("");
              this.handleResult("success")
            },

            error: () => {
              this.handleResult("failed");
            }
          });
        }
    })
  }

  handleSearch(){

     const ssfullname  = this.employeeSearchForm.controls['ssfullname'].value;
     const ssnumber  = this.employeeSearchForm.controls['ssnumber'].value;
     const ssgender  = this.employeeSearchForm.controls['ssgender'].value;
     const ssdesignation  = this.employeeSearchForm.controls['ssdesignation'].value;

     let query = ""

    if(ssnumber != null && ssnumber.trim() !="") query = query + "&number=" + ssnumber;
    if(ssfullname != null && ssfullname.trim() !="") query = query + "&fullname=" + ssfullname;
    if(ssgender != 'default') query = query + "&genderid=" + parseInt(ssgender);
    if(ssdesignation != 'default') query = query + "&designationid=" + parseInt(ssdesignation);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
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

  clearSearch() {
    this.dialog.open(WarningDialogComponent,{
      data:{heading:"Clear Search ",message: "Are You Sure You Want To Perform this Operation?"}
    }).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.employeeSearchForm.reset();
        this.employeeSearchForm.controls['ssgender'].setValue('default');
        this.employeeSearchForm.controls['ssdesignation'].setValue('default');
        this.loadTable("");
      }
    });
  }
}
