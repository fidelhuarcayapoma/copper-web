import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Document } from '../interfaces/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
  private apiUrl = environment.msManager + '/documents';

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  createDocument(document: Document): Observable<Document> {
    const formData  = new FormData();
    formData.append('craftId', document.craftId.toString());
    document.files.forEach(file => {
      formData.append('files', file);
    })
    return this.http.post<Document>(this.apiUrl, formData);

  }

  updateDocument(document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${document.id}`, document);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDocumentsByCraftId(id: number) : Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/${id}`);
  }
}