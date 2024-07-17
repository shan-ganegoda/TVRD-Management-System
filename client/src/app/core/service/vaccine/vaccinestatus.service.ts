import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccineStatus} from "../../entity/vaccinestatus";

const API_URL = environment.apiUrl + '/admin/vaccinestatuses';

@Injectable({
  providedIn: 'root'
})
export class VaccinestatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VaccineStatus[]>(API_URL);
  }
}
