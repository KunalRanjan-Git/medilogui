import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass], // Import necessary Angular modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService] // Provide the service
})
export class LoginComponent {
  activeTab: string = 'login';

  loginData = { email: '', password: '' };
  registerData = { name: '', role: '', email: '', password: '', };

  constructor(private authService: AuthService, private loginService: LoginService, private router: Router, private alertService: AlertService) { }

  onLogin() {
    debugger
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        if (response && response.role) {
          localStorage.setItem('userID', response.userID); // Store full user data
          this.authService.login('fake-jwt-token', response.role); // ✅ Store token and role

          // ✅ Redirect based on role
          if (response.role === 'Admin') {
            this.router.navigate(['/manage-users']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }

        // console.log('Login Success:', response);
        // localStorage.setItem('userRole', response.role); // Store user role
        // //localStorage.setItem('loginTime', Date.now().toString()); // Store login time
        // this.authService.login('fake-jwt-token');
        // this.router.navigate(['/dashboard']); // ✅ Redirect to Dashboard
      },
      (error) => {
        console.error('Login Error:', error);

        // ✅ Handle License Expired Error
        if (error?.error?.message === "License expired. Please renew your license.") {
          this.alertService.error('⚠️ License expired. Please renew your license to continue.');
        } else {
          // this.alertService.error('Login failed! Check credentials.');
          this.alertService.error(error.error.message);
        }
      }
    );
  }

  onRegister() {
    this.loginService.register(this.registerData).subscribe(
      (response) => {
        console.log('Registration Success:', response);
        this.alertService.success('Registration successful!'); // ✅ Show success message
        this.activeTab = 'login'; // ✅ Switch to login tab
      },
      (error) => {
        console.error('Registration Error:', error);
        this.alertService.error('Registration failed! Try again.');
      }
    );
  }
}
