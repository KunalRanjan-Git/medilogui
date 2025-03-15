import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule], // ✅ Needed for router links
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTime: string = '';
  loggedInUserId: number | null = null;
  loginUser: any = {
    name: '',
    email: '',
    role: 'User',
    passwordHash: ''
  };;

  constructor(public authService: AuthService, private router: Router,private userService: UserService) {}

  ngOnInit() {
    this.loadLoggedInUser();
    this.loadUsers();
    this.updateTime(); // Initial update
    setInterval(() => this.updateTime(), 1000); // Update time every second
  }

  loadLoggedInUser() {
    const userIdString = localStorage.getItem('userID'); 
    var userId = userIdString ? Number(userIdString) : null;
    if (userId) {
      this.loggedInUserId = userId;
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => { 
        this.loginUser = data;
        this.loginUser = data.filter(user => user.id == this.loggedInUserId);
        console.log(this.loginUser);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
