import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/routes.constant';
import { ROLES } from '../constants/roles.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate():  boolean{
        if (this.authService.getUserStatus(ROLES.ADMIN)) {
            this.router.navigate([`/${ROUTES.ADMIN.path}`]);
            return false;
        } else if (this.authService.getUserStatus(ROLES.DENTIST)) {
            this.router.navigate([`/${ROUTES.DENTIST.path}`]);
            return false;
        } else if (this.authService.getUserStatus(ROLES.RECEPTIONIST)) {
            this.router.navigate([`/${ROUTES.RECEPTIONIST.path}`]);
            return false;
        } else {
            return true;
        }
    }
}