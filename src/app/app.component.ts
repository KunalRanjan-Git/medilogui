import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass], // Import necessary Angular modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService] // Provide the service
})
export class AppComponent {
  title = 'MediLog';
  activeTab: string = 'register';

  loginData = { email: '', password: '' };
  registerData = { fullName: '', email: '', password: '' };

  constructor(private loginService: LoginService,private router: Router) {}

  onLogin() {
    console.log('Login Data:', this.loginData);
    this.loginService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login Success:', response);
        localStorage.setItem('userRole', response.role);
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login Error:', error);
        alert('Login failed!');
      }
    );
  }

  onRegister() {
    console.log('Register Data:', this.registerData);
    this.loginService.register(this.registerData).subscribe(
      (response) => {
        console.log('Registration Success:', response);
        alert('Registration successful!');
        this.activeTab = 'login';
      },
      (error) => {
        console.error('Registration Error:', error);
        alert('Registration failed!');
      }
    );
  }
}
