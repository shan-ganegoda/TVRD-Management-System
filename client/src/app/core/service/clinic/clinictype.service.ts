import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {ClinicType} from "../../entity/clinictype";

const API_URL = environment.apiUrl + '/admin/clinictypes';

@Injectable({
  providedIn: 'root'
})
export class ClinictypeService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<ClinicType[]>(API_URL);
  }
}
