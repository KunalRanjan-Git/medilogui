import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl; // ✅ Use centralized API URL
  //private apiUrl = 'https://localhost:5001/api'; // Base API URL Test
  //private apiUrl = 'http://localhost:5000/api'; // Base API URL Prod

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
