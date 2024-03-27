import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../../entity/employee";

const API_URL = environment.apiUrl + '/admin/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getAllEmployees(query:string){
    return this.http.get<Employee[]>(API_URL+query);
    //console.log(this.http.get<Employee[]>(API_URL+query));
  }

  getEmployeeById(id:number){
    return this.http.get<Employee>(API_URL + '/' + id);
  }

  saveEmployee(employee:Employee){
    console.log(employee);
    return this.http.post<[]>(API_URL,employee);
  }

  deleteEmployee(id:number){
    return this.http.delete(API_URL + '/' + id);
  }

  updateEmployee(employee:Employee){
    return this.http.put<Employee>(API_URL,employee);
  }

  deleteEmployeeByNumber(number:string){
    return this.http.delete(API_URL + "/dnumber/" + number);
  }
}
