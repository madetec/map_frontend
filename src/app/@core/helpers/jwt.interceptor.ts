import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {User} from '../models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private currentUser: User;
    constructor(private authService: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        this.currentUser = this.authService.getCurrentUser;
        if (this.currentUser && this.currentUser.access_token) {
            if (request.url !== 'https://geocode-maps.yandex.ru/1.x/') {
                request = request.clone({
                    setHeaders: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.currentUser.access_token}`
                    }
                });
            }
        }
        return next.handle(request);
    }
}