
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Topic } from '../interfaces/topic.interface';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  http = inject(HttpClient);


  getTopicsByCourseId(courseId: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.msManager}/topics/course/${courseId}`);
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${environment.msManager}/topics/${id}`);
  }

  createTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(`${environment.msManager}/topics`, topic);
  }

  updateTopic(id: number, Topic: Topic): Observable<Topic> {
    return this.http.put<Topic>(`${environment.msManager}/topics/${id}`, Topic);
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.msManager}/topics/${id}`);
  }

  getVideosByTopicId(id: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.msManager}/topics/topic/${id}`);
  }
}