import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Vehicle} from "../../entity/vehicle";
import {Moh} from "../../entity/moh";
const API_URL = environment.apiUrl + '/admin/vehicles';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Vehicle[]>(API_URL + query);
  }

  save(vehicle:Vehicle){
    return this.http.post<[]>(API_URL,vehicle);
  }

  delete(id:number){
    return this.http.delete<string>(API_URL + '/' + id);
  }

  update(vehicle:Vehicle){
    return this.http.put<Moh>(API_URL,vehicle);
  }
}
