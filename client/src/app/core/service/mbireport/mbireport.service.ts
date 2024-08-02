import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {MbiReport} from "../../entity/mbireport";

const API_URL = environment.apiUrl + '/admin/mbireports';

@Injectable({
  providedIn: 'root'
})
export class MbireportService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<MbiReport[]>(API_URL+query);
  }

  save(mbireport:MbiReport){
    return this.http.post<MbiReport>(API_URL,mbireport);
  }

  delete(id:number){
    return this.http.delete(API_URL + '/' + id);
  }

  update(mbireport:MbiReport){
    return this.http.put<MbiReport>(API_URL,mbireport);
  }
}
