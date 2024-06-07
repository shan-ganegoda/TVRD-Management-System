import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Moh} from "../../entity/moh";
import {CountByPdh} from "../entity/countByPdh";
import {CountByPOrders} from "../entity/countByPOrders";

const API_URL = environment.apiUrl + '/admin/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  countByPdh(){
    return this.http.get<CountByPdh[]>(API_URL + "/countbypdh");
  }

  countByPorder(){
    return this.http.get<CountByPOrders[]>(API_URL + "/countbyproductorder");
  }
}
