import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Role } from "../../features/users/interface/user.interface";

@Injectable({
    providedIn: 'root'
  })
  export class RoleService {
  
    constructor(private http: HttpClient) { }
  
    getAll():Observable<Role[]>{
        return this.http.get<Role[]>(`${environment.msManager}/roles`);
    }

  }