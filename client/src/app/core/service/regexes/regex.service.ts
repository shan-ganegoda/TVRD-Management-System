import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";

const API_URL = "http://localhost:8080/regexes/";

@Injectable({
  providedIn: 'root'
})
export class RegexService {

  constructor(private http:HttpClient) { }

  getRegexes(type:string){
    return this.http.get<[]>(API_URL + type);

  }
}
