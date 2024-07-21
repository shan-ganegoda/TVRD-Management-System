import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {ClinicStatus} from "../../entity/clinicstatus";

const API_URL = environment.apiUrl + '/admin/clinicstatuses';

@Injectable({
  providedIn: 'root'
})
export class ClinicstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<ClinicStatus[]>(API_URL);
  }
}
