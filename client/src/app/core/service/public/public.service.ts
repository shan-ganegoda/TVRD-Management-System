import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../../entity/clinic";
import {Mother} from "../../entity/mother";

const API_URL = environment.apiUrl + '/public/mothers';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http:HttpClient) {
  }

  getClinics(){
    return this.http.get<Clinic[]>(API_URL+"/clinic")
  }

  getRegexes(){
    return this.http.get<[]>(API_URL+"/regex");

  }

  saveMother(mother:Mother){
    return this.http.post<Mother>(API_URL,mother);
  }

  getAllM(query:string){
    return this.http.get<Mother[]>(API_URL+query);
  }
}
