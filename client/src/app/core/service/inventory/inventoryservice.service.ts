import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {InventoryStatus} from "../../entity/inventorystatus";

const API_URL = environment.apiUrl + '/admin/inventorystatuses';

@Injectable({
  providedIn: 'root'
})
export class InventoryserviceService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<InventoryStatus[]>(API_URL);
  }
}
