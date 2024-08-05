import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Grn} from "../../entity/grn";
import {environment} from "../../../environment";
import {Inventory} from "../../entity/inventory";

const API_URL = environment.apiUrl + '/admin/inventories';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Inventory[]>(API_URL + query);
  }

  save(inventory:Inventory){
    return this.http.post<Inventory>(API_URL,inventory);
  }

  update(inventory:Inventory){
    return this.http.put<Inventory>(API_URL,inventory);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
