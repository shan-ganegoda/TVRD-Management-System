import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/auth/storage.service";
import {ToastService} from "../util/toast/toast.service";
import {UsersService} from "../service/user/users.service";

// interface AuthForm {
//   password: FormControl<string>;
//   email: FormControl<string>;
// }

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{

  authForm: FormGroup;
  forgetForm: FormGroup;

  isLogin:any;
  isForget:any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly formBuilder: FormBuilder,
    private readonly storageService: StorageService,
    private readonly tst:ToastService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.formBuilder.group({
      email: new FormControl("",  [Validators.required]),
      password: new FormControl("",  [Validators.required]),
    });
    this.forgetForm = this.formBuilder.group({
      forgetemail: new FormControl("",  [Validators.required]),
    });
  }

  ngOnInit() {
    this.isLoginClick();

    if(this.storageService.isLoggedIn()){
      //window.alert("User Already Logged In,if you need to log in again please log Out First!");
      this.router.navigateByUrl('/main/home');
    }
  }

  isLoginClick(){
    this.isForget = false;
    this.isLogin = true;

  }

  isForgetClick(){
    this.isLogin = false;
    this.isForget = true;
  }

  submitForm(): void {

      if(this.authForm.valid){

        const {email , password} = this.authForm.getRawValue()
        // console.log(email);

        this.authService.login(email,password).subscribe({
          next:(data:any) => {
            this.storageService.saveUser(data.user);
            //console.log(data.authUser.user);
            this.storageService.saveUserAuthorities(data["authorities"]);

            this.router.navigateByUrl('/main/home');
            this.authForm.reset();
          },
          error: (error:any) => {
            console.log(error);
            this.tst.handleResult("failed","Invalid Email And Password!");
          }
          })
      }else{
        this.tst.handleResult("Failed","Invalid Email And Password!");
      }

    }

  forgetForms(){
    if(this.forgetForm.valid){

      const email = this.forgetForm.getRawValue()
      // console.log(email);

      this.authService.checkUser(email).subscribe({
        next:(data:any) => {
          console.log(data);
          this.tst.handleResult("success","Check Your MailBox!");
        },
        error: (error:any) => {
          console.log(error);
          this.tst.handleResult("Failed","User Not Found!");
        }
      })
    }else{
      this.tst.handleResult("Failed","Invalid Email");
    }
  }


}
