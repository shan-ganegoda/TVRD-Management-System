import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Grn} from "../../entity/grn";
import {A} from "@angular/cdk/keycodes";

const API_URL = environment.apiUrl + '/admin/grns';

@Injectable({
  providedIn: 'root'
})
export class GrnService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Grn[]>(API_URL + query);
  }

  save(grn:Grn){
    return this.http.post<Grn>(API_URL,grn);
  }

  update(grn:Grn){
    return this.http.put<Grn>(API_URL,grn);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
