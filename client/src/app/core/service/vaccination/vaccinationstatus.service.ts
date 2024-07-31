import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccinationStatus} from "../../entity/vaccinationstatus";

const API_URL = environment.apiUrl + '/admin/vaccinationstatuses';

@Injectable({
  providedIn: 'root'
})
export class VaccinationstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VaccinationStatus[]>(API_URL);
  }
}
