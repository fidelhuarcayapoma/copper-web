import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Craft } from '../interfaces/craft.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CraftService {
  private apiUrl = environment.msManager + '/crafts';

  constructor(private http: HttpClient) { }

  getCrafts(): Observable<Craft[]> {
    return this.http.get<Craft[]>(this.apiUrl);
  }

  getCraftById(id: number): Observable<Craft> {
    return this.http.get<Craft>(`${this.apiUrl}/${id}`);
  }

  createCraft(craft: Craft): Observable<Craft> {
    return this.http.post<Craft>(this.apiUrl, craft);
  }

  updateCraft(craft: Craft): Observable<Craft> {
    return this.http.put<Craft>(`${this.apiUrl}/${craft.id}`, craft);
  }

  deleteCraft(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}