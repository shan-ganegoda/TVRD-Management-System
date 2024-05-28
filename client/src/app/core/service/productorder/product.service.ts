import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {ProductOrder} from "../../entity/productorder";
import {Product} from "../../entity/product";

const API_URL = environment.apiUrl + '/admin/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getAllProducts(){
    return this.http.get<Product[]>(API_URL);
  }

  getProduct(id:number){
    return this.http.get<Product>(API_URL + "/" + id);
  }
}
