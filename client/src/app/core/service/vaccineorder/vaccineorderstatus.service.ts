import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccineOrderStatus} from "../../entity/vaccineorderstatus";

const API_URL = environment.apiUrl + '/admin/vaccineorderstatuses';

@Injectable({
  providedIn: 'root'
})
export class VaccineorderstatusService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<VaccineOrderStatus[]>(API_URL);
  }
}
