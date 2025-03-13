import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule], // ✅ Needed for router links
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTime: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateTime(); // Initial update
    setInterval(() => this.updateTime(), 1000); // Update time every second
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
