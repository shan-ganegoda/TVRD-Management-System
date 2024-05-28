import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {User} from "../../entity/user";

const API_URL = environment.apiUrl + '/admin/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getAllUsers(query:string){
    return this.http.get<User[]>(API_URL + query);
  }

  getUserById(id:number){
    return this.http.get<User>(API_URL + '/' + id);
  }

  saveUser(user:User){
    console.log(user);
    return this.http.post<[]>(API_URL,user);
  }

  updateUser(user:User){
    return this.http.put(API_URL,user);
  }

  deleteUser(id:number){
    return this.http.delete<User>(API_URL + '/' + id);
  }
}
