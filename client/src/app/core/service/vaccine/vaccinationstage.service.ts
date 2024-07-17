import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccinationStage} from "../../entity/vaccinationstage";

const API_URL = environment.apiUrl + '/admin/vaccinationstages';

@Injectable({
  providedIn: 'root'
})
export class VaccinationstageService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VaccinationStage[]>(API_URL);
  }
}
