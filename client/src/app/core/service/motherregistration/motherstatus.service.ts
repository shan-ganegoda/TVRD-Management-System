import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {MotherStatus} from "../../entity/motherstatus";

const API_URL = environment.apiUrl + '/admin/motherstatuses';

@Injectable({
  providedIn: 'root'
})
export class MotherstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<MotherStatus[]>(API_URL);
  }
}
