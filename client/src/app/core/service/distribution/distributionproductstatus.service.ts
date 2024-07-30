import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../../entity/clinic";
import {DistributionProductStatus} from "../../entity/distributionproductstatus";

const API_URL = environment.apiUrl + '/admin/distributionproductstatuses';

@Injectable({
  providedIn: 'root'
})
export class DistributionproductstatusService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<DistributionProductStatus[]>(API_URL);
  }
}
