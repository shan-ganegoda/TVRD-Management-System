import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../../entity/clinic";

const API_URL = environment.apiUrl + '/admin/clinics';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private http: HttpClient) { }

  getAll(query:string){
    return this.http.get<Clinic[]>(API_URL+query);
  }

  getAllList(){
    return this.http.get<Clinic[]>(API_URL + "/list");
  }

  save(clinic:Clinic){
    return this.http.post<Clinic>(API_URL,clinic);
  }

  update(clinic:Clinic){
    return this.http.put<Clinic>(API_URL,clinic);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
