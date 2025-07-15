import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string = '';
  userRole: string = '';
  isCollapsed = true;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  
  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
    this.userRole = this.authService.getRole() || 'VIEWER';
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logged Out', 'You have been successfully logged out.');
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeNavbar(): void {
    this.isCollapsed = true;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  getRoleDisplayName(): string {
    return this.userRole === 'ADMIN' ? 'Administrator' : 'Viewer';
  }

  getRoleBadgeClass(): string {
    return this.userRole === 'ADMIN' ? 'bg-primary' : 'bg-secondary';
  }
}
