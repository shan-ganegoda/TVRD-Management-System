import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {VaccineOffering} from "../../entity/vaccineoffering";

const API_URL = environment.apiUrl + '/admin/vaccineofferings';

@Injectable({
  providedIn: 'root'
})
export class VaccineofferingService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VaccineOffering[]>(API_URL);
  }
}
