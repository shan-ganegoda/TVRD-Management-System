import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StorageService} from "../../core/service/auth/storage.service";
import {User} from "../../core/entity/user";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {UsersService} from "../../core/service/user/users.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/util/toast/toast.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  user!: User;
  imageempurl!: any;
  isDisabled = true;

  uregexes:any;
  eregexes:any;

  userForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
              private ss: StorageService,
              private fb: FormBuilder,
              private es: EmployeeService,
              private us: UsersService,
              private dialog:MatDialog,
              private tst: ToastService
  ) {
    this.userForm = this.fb.group({
      "fullname" : [{ value: '', disabled: true }],
      "email" : [{ value: '', disabled: true }],
      "description" : [{ value: '', disabled: true }],
      "photo" : new FormControl('', [Validators.required]),
    });

    this.passwordForm = this.fb.group({
      "currentpassword" : [{ value: ''}, [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]],
      "newpassword" : [{ value: ''},[Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]],
      "confirmpassword" : [{ value: ''}, [Validators.required,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]],
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.user = this.ss.getUser();
    this.fillDetails();


  }


  fillDetails(){

    this.isDisabled = false;

    if(this.user.employee.photo){
      this.imageempurl = this.urlToImage(this.user.employee.photo);
      this.userForm.controls['photo'].clearValidators();
    }

    this.userForm.patchValue({
      fullname: this.user.employee.fullname,
      email: this.user.email,
      description: this.user.description,
      photo: ''
    });


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
    this.userForm.controls['photo'].setErrors({'required': true});
  }

  updatePassword(){
    const user:User = {
      id: this.user.id,
      email: this.user.email,
      password: '',

      usertype: this.user.usertype,
      userstatus: this.user.userstatus,
      description: this.user.description,
      employee: this.user.employee,
      roles: this.user.roles,
    }

    if(this.passwordForm.valid){
      if(this.passwordForm.controls["newpassword"].value === this.passwordForm.controls["confirmpassword"].value){

        user.password = this.passwordForm.controls["confirmpassword"].value;


        const currentOperation = "Update User " +user.email;

        this.dialog.open(ConfirmDialogComponent,{data: currentOperation})
          .afterClosed().subscribe(res => {
          if(res) {
            this.us.updateUser(user).subscribe({
              next:() => {
                this.tst.handleResult('success'," User Password Updated Successfully");
              },
              error:(err:any) => {
                this.tst.handleResult('failed',err.error.data.message);
              }
            });
          }
        })
      }else{
        this.tst.handleResult("Failed","Passwords Do Not Match");
      }
    }
  }


}
