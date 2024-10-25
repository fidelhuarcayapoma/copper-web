import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Area } from '../interfaces/area.interface';

@Injectable({
    providedIn: 'root'
})
export class AreaService {

    http = inject(HttpClient);

    getAreas(): Observable<Area[]> {
        return this.http.get<Area[]>(`${environment.msManager}/areas`);
    }

    getArea(id: number): Observable<Area> {
        return this.http.get<Area>(`${environment.msManager}/areas/${id}`);
    }

    createArea(area: any): Observable<Area> {
        return this.http.post<Area>(`${environment.msManager}/areas`, area);
    }

    updateArea(id: number, area: any): Observable<Area> {
        return this.http.put<Area>(`${environment.msManager}/areas/${id}`, area);
    }

    deleteArea(id: number): Observable<Area> {
        return this.http.delete<Area>(`${environment.msManager}/areas/${id}`);
    }

    getAreasByMiningUnitId(id: number): Observable<Area[]> {
        return this.http.get<Area[]>(`${environment.msManager}/areas/${id}`);
    }
}