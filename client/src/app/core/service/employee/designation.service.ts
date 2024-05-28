import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Designation} from "../../entity/designation";
import {environment} from "../../../environment";

const API_URL = environment.apiUrl + '/admin/designations';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(private http:HttpClient) { }

  getAllDesignations(){
    return this.http.get<Designation[]>(API_URL);
  }
}
