import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService, private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if (this.isUnauthorized(err.status) || this.isForbidden(err.status)) {
                if (this.isOauth(err.url)) {
                    this.authService.onLoginIncorrect.emit('Неверный логин или пароль');
                } else if (this.isTokenExpired(err.error.message)) {
                    this.authService.refreshToken();
                } else {
                    this.authService.logout();
                    this.authService.onLoginIncorrect.emit(err.error.message);
                }
            }

            if (this.isInvalidRefreshToken(err.error.message)) {
                this.authService.logout();
                this.authService.onLoginIncorrect.emit(err.error.message);
            }
            return throwError(err);
        }));
    }


    private isInvalidRefreshToken(message) {
        return message === 'Invalid refresh token';
    }

    private isTokenExpired(message) {
        return message === 'Your request was made with invalid credentials.';
    }

    private isUnauthorized(status) {
        return status === 401;
    }

    private isForbidden(status) {
        return status === 403;
    }

    private isOauth(url) {
        return url === 'http://api.telecom-car.uz/oauth2/token';
    }
}