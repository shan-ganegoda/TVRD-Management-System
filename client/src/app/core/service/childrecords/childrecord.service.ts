import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {ChildRecord} from "../../entity/childrecord";

const API_URL = environment.apiUrl + '/admin/childrecords';

@Injectable({
  providedIn: 'root'
})
export class ChildrecordService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<ChildRecord[]>(API_URL+query);
  }

  save(childrecord:ChildRecord){
    return this.http.post<ChildRecord>(API_URL,childrecord);
  }

  update(childrecord:ChildRecord){
    return this.http.put<ChildRecord>(API_URL,childrecord);
  }

  delete(id:number){
    return this.http.delete(API_URL +"/"+ id)
  }
}
