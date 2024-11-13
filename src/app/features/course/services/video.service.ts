
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Video } from '../interfaces/video.interfsce';

@Injectable({
    providedIn: 'root'
  })
  export class VideoService {
    constructor(private http: HttpClient) {}
  
    getVideosByCourseId(id: number): Observable<Video[]> {
      return this.http.get<Video[]>(`${environment.msManager}/videos/topic/${id}`);
    }
  
    createVideo(video: any): Observable<any> {
      return this.http.post(`${environment.msManager}/videos`, video);
    }
  }