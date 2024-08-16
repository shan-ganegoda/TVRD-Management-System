import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {BehaviorSubject, filter, map, tap} from "rxjs";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {TokenService} from "./token.service";
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";

export interface UserData{
  token: string;
  id: string;
}

const API_URL = environment.apiUrl + '/auth/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router:Router,
    private tokenService: TokenService,
    private http:HttpClient
  ) { }

  login(email:string,password:string){
    return this.http.post(API_URL + 'authenticate',{email,password})
      .pipe(
        tap((response: any) =>{
          this.tokenService.setToken(response.access_token);
        })
      )
  }

  refreshToken(){
    return this.http.get(API_URL + 'refresh');
  }

  logout(){
    this.http.get(API_URL + 'logout');
  }

  checkUser(email:string){
    return this.http.post(API_URL + 'check',email);
  }


}
