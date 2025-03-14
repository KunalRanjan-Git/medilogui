import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl; // ✅ Use centralized API URL
  //private apiUrl = 'https://localhost:5001/api'; // Base URL of your .NET API
  //private apiUrl = 'http://localhost:5000/api'; // Base API URL Prod

  constructor(private http: HttpClient) {}

  // User Authentication
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login/login`, {email: data.email,
      passwordHash: data.password,});
  }

  register(data: { name: string; role:string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login/register`, {Role: "User",
      name: data.name,
      role: data.role,
      email: data.email,
      passwordHash: data.password,});
  }

}
