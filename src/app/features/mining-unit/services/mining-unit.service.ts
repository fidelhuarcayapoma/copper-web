import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MiningUnit } from '../interfaces/mining-unit.interface';

@Injectable({
  providedIn: 'root'
})
export class MiningUnitService {

  constructor(private http: HttpClient) {}

  getMiningUnits(): Observable<MiningUnit[]> {
    return this.http.get<MiningUnit[]>(`${environment.msManager}/mining-units`);
  }

  getMiningUnit(id: number): Observable<any> {
    return this.http.get<any>(`${environment.msManager}/mining-units/${id}`);
  }

  createMiningUnit(miningUnit: any): Observable<MiningUnit> {
    return this.http.post<MiningUnit>(`${environment.msManager}/mining-units`, miningUnit);
  }

  updateMiningUnit(id: number, miningUnit: any): Observable<MiningUnit> {
    return this.http.put<MiningUnit>(`${environment.msManager}/mining-units/${id}`, miningUnit);
  }

  deleteMiningUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.msManager}/mining-units/${id}`);
  }
}