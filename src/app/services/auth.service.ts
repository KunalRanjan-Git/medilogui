import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private maxSessionTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(private router: Router) {}

  login(token: string, role: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role); // ✅ Store role in localStorage
    localStorage.setItem('loginTime', Date.now().toString()); // Store login time
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');
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

  getUserRole(): string | null {
    return localStorage.getItem('userRole'); // ✅ Get role
  }

  checkSession() {
    if (!this.isLoggedIn()) {
      this.logout();
    }
  }
}
