import { Injectable } from '@angular/core';
import {Rdh} from "../../entity/rdh";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {MohStatus} from "../../entity/mohstatus";

const API_URL = environment.apiUrl + '/admin/mohstatuses';
@Injectable({
  providedIn: 'root'
})
export class MohstatusService {

  constructor(private http:HttpClient) { }

  getAllMohStatuses(){
    return this.http.get<MohStatus[]>(API_URL);
  }
}
