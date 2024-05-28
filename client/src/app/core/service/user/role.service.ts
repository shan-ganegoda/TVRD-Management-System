import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Role} from "../../entity/role";

const API_URL = environment.apiUrl + '/admin/roles';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  getAllRoles(){
    return this.http.get<Role[]>(API_URL);
  }
}
