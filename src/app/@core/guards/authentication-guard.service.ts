import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

    constructor(private authService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.authService.isAuthenticated();
    }
}
