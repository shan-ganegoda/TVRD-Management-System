import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Dose} from "../../entity/dose";

const API_URL = environment.apiUrl + '/admin/doses';

@Injectable({
  providedIn: 'root'
})
export class DoseService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<Dose[]>(API_URL);
  }
}
