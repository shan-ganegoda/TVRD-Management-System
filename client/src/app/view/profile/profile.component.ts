import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StorageService} from "../../core/service/auth/storage.service";
import {User} from "../../core/entity/user";

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

  userForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private ss: StorageService,private fb: FormBuilder) {
    this.userForm = this.fb.group({
      "name" : [{ value: ''}, [Validators.required]],
      "email" : [{ value: '', disabled: true }],
      "description" : [{ value: ''}, [Validators.required]],
      "photo" : new FormControl(''),
    });

    this.passwordForm = this.fb.group({
      "currentpassword" : [{ value: ''}, [Validators.required]],
      "newpassword" : [{ value: ''}],
      "confirmpassword" : [{ value: ''}, [Validators.required]],
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
      name: this.user.employee.fullname,
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
}
