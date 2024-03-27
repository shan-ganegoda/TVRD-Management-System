import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthService} from "../service/auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationComponent} from "../../shared/dialog/notification/notification.component";
import {StorageService} from "../service/auth/storage.service";

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
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{

  authForm: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly message: MatSnackBar,
    private readonly storageService: StorageService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.formBuilder.group({
      email: new FormControl("",  [Validators.required]),
      password: new FormControl("",  [Validators.required]),
    });
  }

  ngOnInit() {

    if(this.storageService.isLoggedIn()){
      window.alert("User Already Logged In,if you need to log in again please log Out First!");
      this.router.navigateByUrl('/main/home');
    }
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
            this.message.openFromComponent(NotificationComponent,{
              data:{
                message: "Wrong Credentials!",
                icon: "clear"
              },
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 5000,
              panelClass: ['failure-snackbar'],
            });

          }
          })
      }

    }


}
