import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.msManager}/equipments`);
  }

  getEquipmentById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.msManager}/equipments/${id}`);
  }

  createEquipment(equipment: any): Observable<any> {
    return this.http.post<any>(`${environment.msManager}/equipments`, equipment);
  }

  updateEquipment(id: number, equipment: any): Observable<any> {
    return this.http.put<any>(`${environment.msManager}/equipments/${id}`, equipment);
  }

  deleteEquipment(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.msManager}/equipments/${id}`);
  }
}