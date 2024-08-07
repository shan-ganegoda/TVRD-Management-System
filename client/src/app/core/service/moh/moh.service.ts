import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Moh} from "../../entity/moh";
import {MohPacketUpdate} from "../../entity/mohpacketupdate";

const API_URL = environment.apiUrl + '/admin/mohdetails';
@Injectable({
  providedIn: 'root'
})
export class MohService {

  constructor(private http:HttpClient) { }
  getAllMohs(query:string){
    return this.http.get<Moh[]>(API_URL+query);
  }

  getAllMohsList(){
    return this.http.get<Moh[]>(API_URL + '/list');
  }

  getMohById(id:number){
    return this.http.get<Moh>(API_URL + '/' + id);
  }

  saveMoh(moh:Moh){
    return this.http.post<[]>(API_URL,moh);
  }

  deleteMoh(id:number){
    return this.http.delete<string>(API_URL + '/' + id);
  }

  updateMoh(moh:Moh){
    return this.http.put<Moh>(API_URL,moh);
  }

  updateMohPacketCount(moh:MohPacketUpdate){
    return this.http.put<Moh>(API_URL+"/packetupdate",moh);
  }


}
