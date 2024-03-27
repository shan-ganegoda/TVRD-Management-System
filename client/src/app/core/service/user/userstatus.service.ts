import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../entity/user";
import {UserStatus} from "../../entity/userstatus";

const API_URL = environment.apiUrl + '/admin/userstatuses';

@Injectable({
  providedIn: 'root'
})
export class UserstatusService {

  constructor(private http:HttpClient) { }

  getAllUserStatuses(){
    return this.http.get<UserStatus[]>(API_URL);
  }
}
