import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Module} from "../../entity/module";
import {environment} from "../../../environment";

const API_URL = environment.apiUrl + '/admin/operations';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<Module[]>(API_URL);
  }
}
