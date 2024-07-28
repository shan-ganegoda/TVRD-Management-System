import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {GrnStatus} from "../../entity/grnstatus";

const API_URL = environment.apiUrl + '/admin/grnstatuses';

@Injectable({
  providedIn: 'root'
})
export class GrnstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<GrnStatus[]>(API_URL);
  }
}
