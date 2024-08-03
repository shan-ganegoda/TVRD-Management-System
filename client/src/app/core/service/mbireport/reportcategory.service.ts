import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {ReportCategory} from "../../entity/reportcategory";

const API_URL = environment.apiUrl + '/admin/reportcategories';

@Injectable({
  providedIn: 'root'
})
export class ReportcategoryService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<ReportCategory[]>(API_URL);
  }
}
