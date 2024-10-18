import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { User } from "../../features/users/interface/user.interface";
import { Status } from "../interfaces/status.interface";

@Injectable({
    providedIn: 'root'
  })
  export class StatusService {
  
    constructor(private http: HttpClient) { }
  
    getAll():Observable<Status[]>{
        return this.http.get<Status[]>(`${environment.msManager}/status`);
    }

  }