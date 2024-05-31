import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Rdh} from "../../entity/rdh";
import {ProductOrder} from "../../entity/productorder";

const API_URL = environment.apiUrl + '/admin/productorders';

@Injectable({
  providedIn: 'root'
})
export class ProductorderService {

  constructor(private http:HttpClient) { }

  getAllProductOrders(){
    return this.http.get<ProductOrder[]>(API_URL);
  }

  savePorder(porder:ProductOrder){
    return this.http.post<ProductOrder>(API_URL,porder);
  }

  updatePorder(porder:ProductOrder){
    return this.http.put<ProductOrder>(API_URL,porder);
  }

  deletePorder(id:number){
    return this.http.delete(API_URL + "/" + id);
  }

}
