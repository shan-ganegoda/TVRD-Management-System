import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../../entity/clinic";
import {Distribution} from "../../entity/distribution";

const API_URL = environment.apiUrl + '/admin/distributions';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private http: HttpClient) { }

  getAll(query:string){
    return this.http.get<Distribution[]>(API_URL+query);
  }

  save(distribution:Distribution){
    return this.http.post<Distribution>(API_URL,distribution);
  }

  update(distribution:Distribution){
    return this.http.put<Distribution>(API_URL,distribution);
  }

  delete(id:number){
    return this.http.delete(API_URL + "/" + id);
  }
}
