import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // 🚫 Redirect unauthenticated users to login
      return false;
    }

    const userRole = this.authService.getUserRole();
    const isAdminRoute = route.routeConfig?.path === 'manage-users';

    if (isAdminRoute && userRole !== 'Admin') {
      this.router.navigate(['/dashboard']); // 🚫 Redirect users to dashboard if not Admin
      return false;
    }

    return true; // ✅ Allow access
  }
}
