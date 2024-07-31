import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccinationProgress} from "../../entity/vaccinationprogress";

const API_URL = environment.apiUrl + '/admin/vaccinationprogresses';

@Injectable({
  providedIn: 'root'
})
export class VaccinationprogressService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VaccinationProgress[]>(API_URL);
  }
}
