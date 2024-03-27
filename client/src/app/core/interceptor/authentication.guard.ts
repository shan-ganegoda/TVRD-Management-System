import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../service/auth/storage.service";

export const authenticationGuard: CanActivateFn = (route, state) => {

  if(inject(StorageService).isLoggedIn()){
    return true;
  }else {
    inject(Router).navigate(['/login']).then();
    return false;
  }
};
