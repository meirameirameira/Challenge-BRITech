import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type UserDTO = { id:number; name:string; email:string; role?:string|null; isActive:boolean; createdAt:string; };
export type UserCreate = { name:string; email:string; password:string; role?:string|null; isActive?:boolean; };
export type UserUpdate = { name:string; email:string; password?:string|null; role?:string|null; isActive:boolean; };

@Injectable({ providedIn: 'root' })
export class UsersService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  listUsers() { return this.http.get<UserDTO[]>(`${this.base}/users/ListUsers`); }
  addUser(body: UserCreate) { return this.http.post<UserDTO>(`${this.base}/users/AddUser`, body); }
  editUser(id:number, body: UserUpdate) { return this.http.put<UserDTO>(`${this.base}/users/EditUsers/${id}`, body); }
  removeUser(id:number) { return this.http.delete(`${this.base}/users/RemoveUser/${id}`, { responseType:'text' }); }
}
