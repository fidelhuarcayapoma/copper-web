import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../interface/user.interface";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class UsersService {
  
    constructor(private http: HttpClient) { }
  
    getAll():Observable<User[]>{
        return this.http.get<User[]>(`${environment.msUsers}/users`);
    }
    createUser(user: User): Observable<User> {
      return this.http.post<User>(`${environment.msUsers}/users`, user);
    }
  
    updateUser(id: number, user: User): Observable<User> {
      return this.http.put<User>(`${environment.msUsers}/users/${id}`, user);
    }

  }