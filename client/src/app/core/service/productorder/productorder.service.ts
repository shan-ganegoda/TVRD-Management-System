import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Rdh} from "../../entity/rdh";
import {ProductOrder} from "../../entity/productorder";
import {POStatusUpdate} from "../../entity/postatusupdate";

const API_URL = environment.apiUrl + '/admin/productorders';

@Injectable({
  providedIn: 'root'
})
export class ProductorderService {

  constructor(private http:HttpClient) { }

  getAllProductOrders(query:string){
    return this.http.get<ProductOrder[]>(API_URL+query);
  }

  savePorder(porder:ProductOrder){
    return this.http.post<ProductOrder>(API_URL,porder);
  }

  updatePorder(porder:ProductOrder){
    return this.http.put<ProductOrder>(API_URL,porder);
  }

  updatePorderStatus(porder:POStatusUpdate){
    return this.http.put<ProductOrder>(API_URL + "/statusupdate",porder);
  }

  deletePorder(id:number){
    return this.http.delete(API_URL + "/" + id);
  }

}
