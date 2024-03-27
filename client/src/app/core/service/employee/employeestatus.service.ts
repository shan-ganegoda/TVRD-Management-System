import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EmployeeStatus} from "../../entity/employeestatus";
import {environment} from "../../../environment";


const API_URL = environment.apiUrl + '/admin/employeestatuses';

@Injectable({
  providedIn: 'root'
})
export class EmployeestatusService {

  constructor(private http:HttpClient) { }

  getAllEmployeeStatuses(){
    return this.http.get<EmployeeStatus[]>(API_URL);
  }
}
