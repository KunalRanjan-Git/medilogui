import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [FormsModule, NgIf,NgClass], // Import necessary Angular modules
    templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    providers: [LoginService] // Provide the service
})
export class LoginComponent {
  activeTab: string = 'login';

  loginData = { email: '', password: '' };
  registerData = { name: '',role: '', email: '', password: '' ,};

  constructor(private authService: AuthService,private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login Success:', response);
        localStorage.setItem('userRole', response.role); // Store user role
        //localStorage.setItem('loginTime', Date.now().toString()); // Store login time
        this.authService.login('fake-jwt-token');
        this.router.navigate(['/dashboard']); // ✅ Redirect to Dashboard
      },
      (error) => {
        console.error('Login Error:', error);
        
        // ✅ Handle License Expired Error
      if (error?.error?.message === "License expired. Please renew your license.") {
        alert("⚠️ License expired. Please renew your license to continue.");
      } else {
        alert('Login failed! Check credentials.');
      }
      }
    );
  }

  onRegister() {
    console.log('Register Data:', this.registerData);
    this.loginService.register(this.registerData).subscribe(
      (response) => {
        console.log('Registration Success:', response);
        alert('Registration successful!');
        this.activeTab = 'login'; // ✅ Switch to login tab
      },
      (error) => {
        console.error('Registration Error:', error);
        alert('Registration failed!');
      }
    );
  }
}
