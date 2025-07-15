import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Smart Inventory Management System';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit() {
    // Check if user is logged in and redirect accordingly
    if (this.authService.isLoggedIn()) {
      // User is logged in, stay on current route or redirect to dashboard
      if (this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // User is not logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
