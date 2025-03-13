import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/api'; // Base URL of your .NET API

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
