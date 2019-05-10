import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private token;

    constructor(
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.authenticationState.subscribe(state => {
            if (state) {
                this.authenticationService.getCurrentUser().subscribe(res => {
                    if (res) {
                        this.token = `${res.token_type} ${res.access_token}`;
                    }
                });
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.token) {
            if (request.url !== 'https://geocode-maps.yandex.ru/1.x/') {
                request = request.clone({
                    setHeaders: {
                        'Content-Type': 'application/json',
                        Authorization: this.token
                    }
                });
            }
        }
        return next.handle(request);
    }
}