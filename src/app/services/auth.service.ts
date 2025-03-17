import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private maxSessionTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private usernameSubject = new BehaviorSubject<string | null>(null); // ✅ Store username

  username$ = this.usernameSubject.asObservable(); // ✅ Observable to subscribe in other components


  constructor(private router: Router) {
    this.loadUsernameFromStorage(); // ✅ Load username on app start
  }

  login(token: string, role: string, username: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role); // ✅ Store role in localStorage
    localStorage.setItem('username', username); // ✅ Store username
    localStorage.setItem('loginTime', Date.now().toString()); // Store login time

    this.usernameSubject.next(username); // ✅ Broadcast username change
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username'); // ✅ Remove username
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userID');

    this.usernameSubject.next(null); // ✅ Broadcast logout
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const elapsedTime = Date.now() - parseInt(loginTime, 10);
      if (elapsedTime > this.maxSessionTime) {
        this.logout(); // Force logout after 24 hours
        return false;
      }
    }
    return !!localStorage.getItem('authToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('username'); // ✅ Get username
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole'); // ✅ Get role
  }

  checkSession() {
    if (!this.isLoggedIn()) {
      this.logout();
    }
  }
  private loadUsernameFromStorage() {
    const storedUsername = this.getUsername();
    if (storedUsername) {
      this.usernameSubject.next(storedUsername); // ✅ Sync stored username with BehaviorSubject
    }
  }
}
