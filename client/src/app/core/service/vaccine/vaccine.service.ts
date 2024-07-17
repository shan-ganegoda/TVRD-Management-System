import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Vaccine} from "../../entity/vaccine";

const API_URL = environment.apiUrl + '/admin/vaccines';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Vaccine[]>(API_URL+query);
  }

  save(vaccine:Vaccine){
    return this.http.post<Vaccine>(API_URL,vaccine);
  }

  update(vaccine:Vaccine){
    return this.http.put<Vaccine>(API_URL,vaccine);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
