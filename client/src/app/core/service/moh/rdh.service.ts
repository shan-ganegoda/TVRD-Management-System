import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Rdh} from "../../entity/rdh";

const API_URL = environment.apiUrl + '/admin/rdhs';

@Injectable({
  providedIn: 'root'
})
export class RdhService {

  constructor(private http:HttpClient) { }

  getAllDistricts(){
    return this.http.get<Rdh[]>(API_URL);
  }
}
