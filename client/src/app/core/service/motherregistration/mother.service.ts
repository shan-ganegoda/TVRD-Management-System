import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Mother} from "../../entity/mother";

const API_URL = environment.apiUrl + '/admin/mothers';

@Injectable({
  providedIn: 'root'
})
export class MotherService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Mother[]>(API_URL+query);
  }

  save(mother:Mother){
    return this.http.post<Mother>(API_URL,mother);
  }

  update(mother:Mother){
    return this.http.put<Mother>(API_URL,mother);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
