
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Resource } from '../interfaces/video.interfsce';

@Injectable({
    providedIn: 'root'
  })
  export class ResourceService {
    constructor(private http: HttpClient) {}
  
    getVideosByCourseId(id: number): Observable<Resource[]> {
      return this.http.get<Resource[]>(`${environment.msManager}/resources/topic/${id}`);
    }
  
    createResource(resource: any): Observable<Resource> {
      return this.http.post<Resource>(`${environment.msManager}/resources`, resource);
    }
  }