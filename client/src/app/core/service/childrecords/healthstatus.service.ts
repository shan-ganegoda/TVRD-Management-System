import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {HealthStatus} from "../../entity/healthstatus";

const API_URL = environment.apiUrl + '/admin/healthstatuses';

@Injectable({
  providedIn: 'root'
})
export class HealthstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<HealthStatus[]>(API_URL);
  }
}
