import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    
    if (!requiredRole) {
      return true; // No role requirement
    }

    if (this.authService.hasRole(requiredRole)) {
      return true;
    } else {
      this.toastService.error('Access Denied', 'You do not have permission to access this page.');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
