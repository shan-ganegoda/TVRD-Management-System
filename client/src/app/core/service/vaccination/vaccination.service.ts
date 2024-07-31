import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Vaccination} from "../../entity/vaccination";

const API_URL = environment.apiUrl + '/admin/vaccinations';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Vaccination[]>(API_URL + query);
  }

  save(vaccination:Vaccination){
    return this.http.post<Vaccination>(API_URL,vaccination);
  }

  update(vaccination:Vaccination){
    return this.http.put<Vaccination>(API_URL,vaccination);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
