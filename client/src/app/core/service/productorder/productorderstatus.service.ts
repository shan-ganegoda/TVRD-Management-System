import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Rdh} from "../../entity/rdh";
import {ProductOrder} from "../../entity/productorder";
import {ProductOrderStatus} from "../../entity/productorderstatus";

const API_URL = environment.apiUrl + '/admin/productorderstatuses';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderStatusService {

  constructor(private http:HttpClient) { }

  getAllProductOrderStatuses(){
    return this.http.get<ProductOrderStatus[]>(API_URL);
  }
}
