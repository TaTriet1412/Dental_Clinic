import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../constants/roles.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthReceptionistGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.getAuthStatus() && this.authService.getUserStatus(ROLES.DENTIST)) {
      sessionStorage.setItem('currentUrl', location.hash);
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
