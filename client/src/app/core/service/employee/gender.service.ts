import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Gender} from "../../entity/gender";

const API_URL = environment.apiUrl + '/admin/genders';
@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(private http:HttpClient) {  }

  getGenderList(){
    return this.http.get<Gender[]>(API_URL)
  }
}
