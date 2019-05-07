import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {Storage} from '@ionic/storage';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    token;

    constructor(
        private storage: Storage,
        private authenticationService: AuthenticationService
    ) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.isAuthenticated()) {
            this.storage.get('current user').then(res => {
                if (res) {
                    this.token = `${res.token_type} ${res.access_token}`;
                } else {
                    this.authenticationService.getCurrentUser().subscribe(data => {
                        if (data) {
                            this.token = `${data.token_type} ${data.access_token}`;
                        }
                    });
                }
            });
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