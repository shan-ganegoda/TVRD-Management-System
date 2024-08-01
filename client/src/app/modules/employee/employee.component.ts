import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../core/entity/employee";
import {MatDialog} from "@angular/material/dialog";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {GenderService} from "../../core/service/employee/gender.service";
import {Gender} from "../../core/entity/gender";
import {DesignationService} from "../../core/service/employee/designation.service";
import {Designation} from "../../core/entity/designation";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {RegexService} from "../../core/service/regexes/regex.service";
import {EmpType} from "../../core/entity/emptype";
import {EmployeeStatus} from "../../core/entity/employeestatus";
import {EmptypeService} from "../../core/service/employee/emptype.service";
import {EmployeestatusService} from "../../core/service/employee/employeestatus.service";
import {RouterLink} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AsyncPipe} from "@angular/common";
import {ToastService} from "../../core/util/toast/toast.service";



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    PageLoadingComponent,
    PageErrorComponent,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    RouterLink,
    MatPaginator,
    AsyncPipe
  ],
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit{

  isFailed = false;
  isLoading = false;

  employees: Employee[] = [];
  genders: Gender[] = [];
  designations: Designation[] = [];
  emptypes: EmpType[] = [];
  employeestatuses: EmployeeStatus[] = [];

  regexes:any;

  oldEmployee!: Employee;
  employee!:Employee;
  selectedRow!:Employee;

  currentOperation = '';

  imageempurl: any = 'assets/tabledefault.png';

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Employee-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Employee-Delete"); //need to be false
  protected hasWriteAuthority = this.authorizationService.hasAuthority("Employee-Write"); //need to be false
  protected hasReadAuthority = this.authorizationService.hasAuthority("Employee-Read"); //need to be false

  employeeSearchForm:FormGroup;
  employeeForm!:FormGroup;

  dataSource!: MatTableDataSource<Employee>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
              private dialog:MatDialog,
              private es:EmployeeService,
              private gs:GenderService,
              private ds:DesignationService,
              private fb:FormBuilder,
              private tst:ToastService,
              private rs:RegexService,
              private ets:EmptypeService,
              private ess:EmployeestatusService,
              private authorizationService:AuthorizationService,
              private cdr:ChangeDetectorRef
  ) {

    this.employeeSearchForm = this.fb.group({
      ssfullname:[null,[Validators.pattern(/^([A-Z][a-z]*[.]?[\s]?)*([A-Z][a-z]*)$/)]],
      ssnumber:[null,[Validators.pattern(/^E[0-9]{3}$/)]],
      ssgender:['default',Validators.required],
      ssdesignation:['default',Validators.required],
    });

    this.employeeForm = this.fb.group({
      "number": new FormControl('',[Validators.required]),
      "fullname": new FormControl('',[Validators.required]),
      "callingname": new FormControl('',[Validators.required]),
      "nic": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "mobile": new FormControl('',[Validators.required]),
      "land": new FormControl('',[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "dobirth": new FormControl('',[Validators.required]),
      "emptype": new FormControl(null,[Validators.required]),
      "gender": new FormControl(null,[Validators.required]),
      "designation": new FormControl(null,[Validators.required]),
      "employeestatus": new FormControl(null,[Validators.required]),
      "photo": new FormControl('', [Validators.required]),
    },{updateOn:'change'});
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

    this.rs.getRegexes('employee').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

    this.ess.getAllEmployeeStatuses().subscribe({
      next:data => this.employeestatuses = data,
    });

    this.ets.getAllEmpTypes().subscribe({
      next:data => this.emptypes = data,
    });
  }

  loadTable(query:string){
    this.es.getAllEmployees(query).subscribe({
      next:data =>{
        this.employees = data;
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
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
    this.employeeForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.employeeForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.employeeForm.controls['land'].setValidators([Validators.required,Validators.pattern(this.regexes['land']['regex'])]);
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
            if (value === this.employee[controlName]) {
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

  selectImage(event: any): void {
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imageempurl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  urlToImage(url:string){
    return 'data:image/jpeg;base64,' + url;
  }

  clearImage(): void {
    this.imageempurl = 'assets/tabledefault.png';
    this.employeeForm.controls['photo'].setErrors({'required': true});
  }

  fillForm(employee:Employee){
    this.enableButtons(false,true,true);

    this.selectedRow = employee;

    this.employee = employee;
    this.oldEmployee = this.employee;

    if(this.employee.photo){
      this.imageempurl = this.urlToImage(this.employee.photo);
      this.employeeForm.controls['photo'].clearValidators();
   }

    //this.employee.photo = "";


    //this.employeeForm.patchValue(this.employee);

    this.employeeForm.setValue({
      fullname: this.employee.fullname,
      callingname: this.employee.callingname,
      nic: this.employee.nic,
      address: this.employee.address,
      email: this.employee.email,
      mobile: this.employee.mobile,
      land: this.employee.land,
      number: this.employee.number,
      gender: this.employee.gender?.id,
      designation: this.employee.designation?.id,
      employeestatus: this.employee.employeestatus?.id,
      emptype: this.employee.emptype?.id,
      dobirth: this.employee.dobirth,
      description: this.employee.description,
      photo: "",
    });

    this.employeeForm.markAsPristine();

  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.employeeForm.controls) {
      const control = this.employeeForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
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
        photo: this.imageempurl.split(',')[1],
        number: this.employeeForm.controls['number'].value,
        address: this.employeeForm.controls['address'].value,
        email: this.employeeForm.controls['email'].value,
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

      this.currentOperation = "Employee Add " +employee.callingname + " ("+employee.number+ ") ";

      this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
        .afterClosed().subscribe(res => {
        if(res) {
          this.es.saveEmployee(employee).subscribe({
            next:() => {
              this.tst.handleResult('success',"Employee Saved Successfully");
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

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Employee Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const employees:Employee = {
              id: employee.id,
              photo: this.imageempurl.split(',')[1],
              number: this.employeeForm.controls['number'].value,
              address: this.employeeForm.controls['address'].value,
              email: this.employeeForm.controls['email'].value,
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
            this.currentOperation = "Employee Update ";

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.es.updateEmployee(employees).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Employee Updated Successfully");
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
          data:{heading:"Updates - Employee Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }

  }

  deleteEmployee(employee:Employee){

    const operation = "Delete Employee " + employee.callingname +" ("+ employee.number +") ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res && employee.id){
        this.es.delete(employee.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success","Employee Deleted Successfully");
            this.clearForm();
          },
          error: (err:any) => {
            this.tst.handleResult("failed",err.error.data.message);
          }
        });
      }
    })
  }

  generateRandomNumber(){
    const numbers = this.employees.map(n => parseInt(<string>n.number?.substring(1)));
    const maxno = Math.max(...numbers);
    const nextno = maxno + 1;
    const formattedNextNumber = 'E' + nextno.toString().padStart(3, '0');
    this.employeeForm.controls['number'].setValue(formattedNextNumber);
  }

  clearForm(){

    this.employeeForm.reset();
    this.employeeForm.controls['gender'].setValue(null);
    this.employeeForm.controls['designation'].setValue(null);
    this.employeeForm.controls['employeestatus'].setValue(null);
    this.enableButtons(true,false,false);

    this.clearImage();

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

  clearSearch() {

    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe(res => {
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
