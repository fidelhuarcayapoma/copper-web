// src/app/services/course.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Course } from '../interfaces/course.interface';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.msManager}/courses`);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${environment.msManager}/courses/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${environment.msManager}/courses`, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${environment.msManager}/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.msManager}/courses/${id}`);
  }
}
