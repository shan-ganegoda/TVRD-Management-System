import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VaccineOrder} from "../../entity/vaccineorder";

const API_URL = environment.apiUrl + '/admin/vaccineorders';

@Injectable({
  providedIn: 'root'
})
export class VaccineorderService {

  constructor( private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<VaccineOrder[]>(API_URL + query);
  }

  save(vaccineorder:VaccineOrder){
    return this.http.post<VaccineOrder>(API_URL,vaccineorder);
  }

  update(vaccineorder:VaccineOrder){
    return this.http.put<VaccineOrder>(API_URL,vaccineorder);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id)
  }
}
