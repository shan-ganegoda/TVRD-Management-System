import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VehicleType} from "../../entity/vehicletype";

const API_URL = environment.apiUrl + '/admin/vehicletypes';

@Injectable({
  providedIn: 'root'
})
export class VehicletypeService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VehicleType[]>(API_URL);
  }
}
