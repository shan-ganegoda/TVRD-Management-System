import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private storageService:StorageService) { }

  hasRole(role:string){
    const authorities = this.storageService.getUserAuthorities();

    if(authorities){
      return authorities.some(a=> a === 'ROLE_' + role);
    }else return false;
  }

  hasAuthority(authority:string){
    const authorities = this.storageService.getUserAuthorities();

    if(authorities){
      return authorities.some(a=>a === authority);
    }else return false;
  }
}
