import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth/auth.service";
import {TokenService} from "../service/auth/token.service";

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // if(authService.isLoggedIn()){
  //   return true;
  // }else{
  //   router.navigateByUrl("login");
  //   return false;
  // }

  tokenService.isAuthenticate.subscribe({
    next: (value) =>{
      if(!value){
        router.navigateByUrl("login");
      }
    },
  });
  return true;
};
