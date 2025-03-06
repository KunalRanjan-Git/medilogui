import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://localhost:7278/api'; // Base API URL

  constructor(private http: HttpClient) {}

  // GET request
  get<T>(endpoint: string, params: any = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params });
  }

  // GET by ID
  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  // PUT request
  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  // DELETE request
  delete<T>(endpoint: string, id: number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
