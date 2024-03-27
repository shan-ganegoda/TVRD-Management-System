import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EmpType} from "../../entity/emptype";
import {environment} from "../../../environment";

const API_URL = environment.apiUrl + '/admin/emptypes';
@Injectable({
  providedIn: 'root'
})
export class EmptypeService {

  constructor(private http:HttpClient) { }

  getAllEmpTypes(){
    return this.http.get<EmpType[]>(API_URL);
  }
}
