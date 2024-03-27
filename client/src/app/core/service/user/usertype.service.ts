import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {UserStatus} from "../../entity/userstatus";
import {UserType} from "../../entity/usertype";

const API_URL = environment.apiUrl + '/admin/usertypes';
@Injectable({
  providedIn: 'root'
})
export class UsertypeService {

  constructor(private http:HttpClient) { }

  getAllUserTypes(){
    return this.http.get<UserType[]>(API_URL);
  }
}
