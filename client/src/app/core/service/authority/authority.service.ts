import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Authority} from "../../entity/authority";

const API_URL = environment.apiUrl + '/admin/authorities';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Authority[]>(API_URL+query);
  }

  save(authority:Authority){
    return this.http.post<Authority>(API_URL,authority);
  }

  update(authority:Authority){
    return this.http.put<Authority>(API_URL,authority);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
