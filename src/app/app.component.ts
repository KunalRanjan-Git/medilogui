import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MediLoX';
  username: string | null = null; // ✅ Store username

  constructor(private authService: AuthService, private router: Router) {
    this.authService.username$.subscribe(name => {
      this.username = name; // ✅ Automatically update when login/logout happens
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.checkSession();
      }
    });

    setInterval(() => {
      this.authService.checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}
