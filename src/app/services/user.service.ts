import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + '/admin';
  private LoginBaseUrl = environment.apiUrl + '/Login';

  constructor(private http: HttpClient) {}

  // ✅ Fetch all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  // ✅ Add New User
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, {
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.password,
    });
  }

  // ✅ Update a user
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }

  // ✅ Delete a user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // ✅ Generate License
  generateLicense(userId: number, daysValid: number): Observable<any> {
    return this.http.post(`${this.LoginBaseUrl}/generate/${userId}`, { daysValid });
  }

  // ✅ Generate License
  renewLicense(userId: number,licenceType: string, daysValid: number): Observable<any> {
    return this.http.post(`${this.LoginBaseUrl}/Renew/${userId}/${licenceType}`, { daysValid });
  }
}
