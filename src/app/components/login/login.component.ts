import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

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

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login Success:', response);
        localStorage.setItem('userRole', response.role); // Store user role
        this.router.navigate(['/dashboard']); // ✅ Redirect to Dashboard
      },
      (error) => {
        console.error('Login Error:', error);
        alert('Login failed! Check credentials.');
      }
    );
  }

  onRegister() {
    debugger;
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
