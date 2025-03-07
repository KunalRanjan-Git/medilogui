import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule], // ✅ Needed for router links
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTime: string = '';

  constructor() {}

  ngOnInit() {
    this.updateTime(); // Initial update
    setInterval(() => this.updateTime(), 1000); // Update time every second
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
  }
}
