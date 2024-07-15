import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {VehicleType} from "../../entity/vehicletype";
import {VehicleModel} from "../../entity/vehiclemodel";

const API_URL = environment.apiUrl + '/admin/vehiclemodels';

@Injectable({
  providedIn: 'root'
})
export class VehiclemodelService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VehicleModel[]>(API_URL);
  }
}
