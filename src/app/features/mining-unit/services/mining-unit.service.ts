import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiningUnitService {

  constructor(private http: HttpClient) {}

  getMiningUnits(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.msManager}/mining-units`);
  }

  getMiningUnit(id: number): Observable<any> {
    return this.http.get<any>(`${environment.msManager}/mining-units/${id}`);
  }

  createMiningUnit(miningUnit: any): Observable<any> {
    return this.http.post<any>(`${environment.msManager}/mining-units`, miningUnit);
  }

  updateMiningUnit(id: number, miningUnit: any): Observable<any> {
    return this.http.put<any>(`${environment.msManager}/mining-units/${id}`, miningUnit);
  }

  deleteMiningUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.msManager}/mining-units/${id}`);
  }
}