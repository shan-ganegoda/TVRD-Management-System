import {Component, Inject, OnInit} from '@angular/core';
import {Employee} from "../../../core/entity/employee";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmployeeService} from "../../../core/service/employee/employee.service";
import {Designation} from "../../../core/entity/designation";
import {EmpType} from "../../../core/entity/emptype";
import {Gender} from "../../../core/entity/gender";
import {EmployeeStatus} from "../../../core/entity/employeestatus";
import {GenderService} from "../../../core/service/employee/gender.service";
import {EmptypeService} from "../../../core/service/employee/emptype.service";
import {EmployeestatusService} from "../../../core/service/employee/employeestatus.service";
import {DesignationService} from "../../../core/service/employee/designation.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationComponent} from "../../../shared/dialog/notification/notification.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {useParallelTs} from "@angular-devkit/build-angular/src/utils/environment-options";
import {RegexService} from "../../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../../shared/dialog/warning-dialog/warning-dialog.component";

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogClose
  ],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnInit{


  isLoading = false;

  employeeImage: any = null;
  currentEmployee!: Employee;
  currentOperation = '';

  oldEmployee!: Employee;
  employee!: Employee;

  employeeForm:FormGroup;

  designations: Designation[] = [];
  emptypes: EmpType[] = [];
  genders: Gender[] = [];
  employeestatuses: EmployeeStatus[] = [];

  regexes:any;

  protected formFieldList: string[] = [
    'number','address',
    'emptype',
    'dobirth','fullname','callingname',
    'land','mobile','nic','employeestatus','gender','description','designation',
  ];

  protected isValid = {
    number:true,
    address:true,
    emptype:true,
    dobirth:true,
    fullname:true,
    callingname:true,
    land:true,
    mobile:true,
    nic:true,
    employeestatus:true,
    gender:true,
    description:true,
    designation:true,
  }

  constructor(
    private es:EmployeeService,
    private gs:GenderService,
    private ets:EmptypeService,
    private ess:EmployeestatusService,
    private ds:DesignationService,
    private rs:RegexService,
    private fb:FormBuilder,
    private dialog:MatDialog,
    private dialogRef:MatDialogRef<EmployeeFormComponent>,
    private snackbar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private employeeid:number,
  ) {

    this.employeeForm = this.fb.group({
      "number": new FormControl('',[Validators.required]),
      "fullname": new FormControl('',[Validators.required]),
      "callingname": new FormControl('',[Validators.required]),
      "nic": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "mobile": new FormControl('',[Validators.required]),
      "land": new FormControl('',[Validators.required]),
      "dobirth": new FormControl('',[Validators.required]),
      "emptype": new FormControl('default',[Validators.required]),
      "gender": new FormControl('default',[Validators.required]),
      "designation": new FormControl('default',[Validators.required]),
      "employeestatus": new FormControl('default',[Validators.required]),
    },{updateOn:'change'});

  }

  ngOnInit(): void {
    this.isLoading = true;

    this.initialize();

  }

  initialize(){

    this.ds.getAllDesignations().subscribe({
      next:data => this.designations = data,
      error: () => this.handleResult('failed')
    });

    this.ess.getAllEmployeeStatuses().subscribe({
      next:data => this.employeestatuses = data,
      error: () => this.handleResult('failed')
    });

    this.ets.getAllEmpTypes().subscribe({
      next:data => this.emptypes = data,
      error: () => this.handleResult('failed')
    });

    this.gs.getGenderList().subscribe({
      next:data => this.genders = data,
      error: () => this.handleResult('failed')
    });

    this.rs.getRegexes('employee').subscribe({
      next:data => this.regexes = data,
      error: () => this.regexes = [] || undefined
    })

    if(this.employeeid){
      this.es.getEmployeeById(this.employeeid).subscribe({

        next:data => {
          this.currentEmployee = data;
          //console.log(this.currentEmployee);
          this.fillForm();
          this.isLoading = false;
        },

        error:() => this.handleResult('failed')
      });
    }else{
      this.currentOperation = 'Add Employee';
      this.isLoading = false;
    }

    this.createForm();
  }

  createForm(){
    this.employeeForm.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.employeeForm.controls['fullname'].setValidators([Validators.required, Validators.pattern(this.regexes['fullname']['regex'])]);
    this.employeeForm.controls['callingname'].setValidators([Validators.required, Validators.pattern(this.regexes['callingname']['regex'])]);
    this.employeeForm.controls['gender'].setValidators([Validators.required]);
    this.employeeForm.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.employeeForm.controls['dobirth'].setValidators([Validators.required]);
    this.employeeForm.controls['photo'].setValidators([Validators.required]);
    this.employeeForm.controls['address'].setValidators([Validators.required]);
    this.employeeForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.employeeForm.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.employeeForm.controls['designation'].setValidators([Validators.required]);
    this.employeeForm.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.employeeForm.controls['emptype'].setValidators([Validators.required]);
    this.employeeForm.controls['employeestatus'].setValidators([Validators.required]);

    Object.values(this.employeeForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.employeeForm.controls) {
      const control = this.employeeForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldEmployee != undefined && control.valid) {
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

    this.oldEmployee = this.currentEmployee;

    if(this.currentEmployee.photo){
      this.employeeImage = this.urlToImage(this.currentEmployee.photo);
    }

    this.employeeForm.setValue({
      fullname: this.currentEmployee.fullname,
      callingname: this.currentEmployee.callingname,
      nic: this.currentEmployee.nic,
      address: this.currentEmployee.address,
      mobile: this.currentEmployee.mobile,
      land: this.currentEmployee.land,
      number: this.currentEmployee.number,
      gender: this.currentEmployee.gender.id,
      designation: this.currentEmployee.designation.id,
      employeestatus: this.currentEmployee.employeestatus.id,
      emptype: this.currentEmployee.emptype.id,
      dobirth: this.currentEmployee.dobirth,
      description: this.currentEmployee.description,
    });

     this.currentOperation = 'Update'+ " '" + this.currentEmployee.callingname + "'" + this.getUpdates();
  }

  setEmployeeImageView(event:any){
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.employeeImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  urlToImage(url:string){
    return 'data:image/jpeg;base64,' + url;
  }


  handleSubmit(){
    this.formFieldList.map(field => {
      if(!this.employeeForm.controls[field].valid) {(this.isValid as any)[field] = false }
    });
  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.employeeForm.controls) {
      const control = this.employeeForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "\n" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }
  updateEmployee(employee:Employee){

    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Employee Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates !=""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Employee Update ",message: "You Have Following Updates \n " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const employees:Employee = {
              id: employee.id,
              photo: this.employeeImage.split(',')[1],
              number: this.employeeForm.controls['number'].value,
              address: this.employeeForm.controls['address'].value,
              callingname: this.employeeForm.controls['callingname'].value,
              fullname: this.employeeForm.controls['fullname'].value,
              dobirth: this.employeeForm.controls['dobirth'].value,
              land: this.employeeForm.controls['land'].value,
              mobile: this.employeeForm.controls['mobile'].value,
              nic: this.employeeForm.controls['nic'].value,
              description: this.employeeForm.controls['description'].value,

              designation: {id: parseInt(this.employeeForm.controls['designation'].value)},
              employeestatus: {id: parseInt(this.employeeForm.controls['employeestatus'].value)},
              gender: {id: parseInt(this.employeeForm.controls['gender'].value)},
              emptype: {id: parseInt(this.employeeForm.controls['emptype'].value)},

            }

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.es.updateEmployee(employees).subscribe({
                  next:() => { this.handleResult('success'); },
                  error:(err:any) => {
                    this.handleResult('failed');
                    //console.log(err);
                  }
                });
              }
            })

          }
        });

      }
    }

  }


  getErrors(){

    let errors:string = "";

    for(const controlName in this.employeeForm.controls){
      const control = this.employeeForm.controls[controlName];
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

  addEmployee(){
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Employee Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{
      //this.employee = this.employeeForm.getRawValue();
      const employee:Employee = {
        photo: this.employeeImage.split(',')[1],
        number: this.employeeForm.controls['number'].value,
        address: this.employeeForm.controls['address'].value,
        callingname: this.employeeForm.controls['callingname'].value,
        fullname: this.employeeForm.controls['fullname'].value,
        dobirth: this.employeeForm.controls['dobirth'].value,
        land: this.employeeForm.controls['land'].value,
        mobile: this.employeeForm.controls['mobile'].value,
        nic: this.employeeForm.controls['nic'].value,
        description: this.employeeForm.controls['description'].value,

        designation: {id: parseInt(this.employeeForm.controls['designation'].value)},
        employeestatus: {id: parseInt(this.employeeForm.controls['employeestatus'].value)},
        gender: {id: parseInt(this.employeeForm.controls['gender'].value)},
        emptype: {id: parseInt(this.employeeForm.controls['emptype'].value)},

      }

      //console.log(employee);

      this.currentOperation += " " +employee.callingname + " ("+employee.number+ ") ";

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.es.saveEmployee(employee).subscribe({
            next:() => { this.handleResult('success'); },
            error:(err:any) => {
              this.handleResult('failed');
              //console.log(err);
            }
          });
        }
      })
    }

  }

  generateRandomNumber(){
    this.employeeForm.controls['number'].setValue('E' + ('' + Math.random()).substring(2,4));
  }

  clearForm(){
    this.employeeForm.reset();
    this.employeeForm.controls['gender'].setValue('default');
    this.employeeForm.controls['designation'].setValue('default');
    this.employeeForm.controls['employeestatus'].setValue('default');

    this.employeeImage = null;

  }

  handleResult(status:string){
    this.dialogRef.close(true);

    if(status === "success"){
      this.snackbar.openFromComponent(NotificationComponent,{
        data:{ message: status,icon: "done_all" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    }else{
      this.snackbar.openFromComponent(NotificationComponent,{
        data:{ message: status,icon: "report" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['failure-snackbar'],
      });
    }
  }

}
