import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {MaritalStatus} from "../../entity/maritalstatus";

const API_URL = environment.apiUrl + '/admin/maritalstatuses';

@Injectable({
  providedIn: 'root'
})
export class MaritalstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<MaritalStatus[]>(API_URL);
  }
}
