import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Report } from "../interfaces/report.interface";

@Injectable({
    providedIn: 'root'
  })
  export class ReportService {
  
    constructor(private http: HttpClient) { }
  
    generateReport():Observable<Report>{
        return this.http.get<Report>(`${environment.msManager}/reports`);
    }

  }