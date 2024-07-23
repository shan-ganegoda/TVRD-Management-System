import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {InvolvementStatus} from "../../entity/involvementstatus";

const API_URL = environment.apiUrl + '/admin/involvementstatuses';

@Injectable({
  providedIn: 'root'
})
export class InvolvementstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<InvolvementStatus[]>(API_URL);
  }
}
