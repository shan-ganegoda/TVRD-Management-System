import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {BloodType} from "../../entity/bloodtype";

const API_URL = environment.apiUrl + '/admin/bloodtypes';

@Injectable({
  providedIn: 'root'
})
export class BloodtypeService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<BloodType[]>(API_URL);
  }
}
