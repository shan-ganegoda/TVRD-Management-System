import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {ReviewStatus} from "../../entity/reviewstatus";

const API_URL = environment.apiUrl + '/admin/reviewstatuses';

@Injectable({
  providedIn: 'root'
})
export class ReviewstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<ReviewStatus[]>(API_URL);
  }
}
