import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  isAuthenticate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
    const token = this.getToken();
    if(token){
      this.updateStatus(true);
    }
  }

  updateStatus(status:boolean){
    this.isAuthenticate.next(status);
  }

  setToken(token:string):void{
    this.updateStatus(true);
    localStorage.setItem("accessToken",token);
  }

  getToken():string|null{
      return localStorage.getItem("accessToken") || null;
  }

  removeToken(){
    this.updateStatus(false);
    return localStorage.removeItem("accessToken");
  }
}
