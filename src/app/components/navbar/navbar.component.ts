import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule], // ✅ Needed for router links
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTime: string = '';
  ClinicName = environment.ClinicName;
  // proUser : boolean = false;
  username: string | null = null; // ✅ Add username

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.username$.subscribe(name => {
      this.username = name; // ✅ Update username in navbar
    });
    // const userRole = this.authService.getUserRole();
    // this.proUser = userRole === 'Pro';
    this.updateTime(); // Initial update
    setInterval(() => this.updateTime(), 1000); // Update time every second
  }


  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
  }

  logout() {
    this.authService.logout();
    this.username = null; // ✅ Clear username on logout
    this.router.navigate(['/login']);
  }
}
