import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Platform} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {User} from '../models/user';

const CURRENT_USER = 'current user';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    authenticationState = new BehaviorSubject(false);
    currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    onLoginIncorrect = new EventEmitter<string>();
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private platform: Platform,
        private router: Router
    ) {
        this.platform.ready().then(() => {
            this.checkToken();
        });
    }

    login(username: string, password: string) {
        const url = 'http://api.telecom-car.uz/oauth2/token';
        const data = {
            grant_type: 'password',
            username: username,
            password: password,
            client_id: 'testclient',
            client_secret: 'testpass'
        };
        const options = {headers: {'Content-Type': 'application/json'}};
        return this.http.post<any>(url, data, options).subscribe(response => {
            if (response.access_token) {
                const user = new User();
                user.setAuthData(
                    username,
                    response.access_token,
                    response.expires_in,
                    response.token_type,
                    response.scope,
                    response.refresh_token
                );
                this.currentUser.next(user);
                this.storage.set(CURRENT_USER, this.currentUser.getValue()).then(res => {
                    if (res) {
                        this.authenticationState.next(true);
                        this.getRole();
                        this.getProfile();
                    }
                });
            }
        });
    }

    getRole() {
        return this.http.get<any>('http://api.telecom-car.uz/user/role')
            .subscribe(data => {
                if (data && data.role) {
                    const user = this.currentUser.getValue();
                    user.setRole(data.role, data.name);
                    this.currentUser.next(user);
                    return this.storage.set(CURRENT_USER, this.currentUser.getValue());
                }
            });
    }

    getProfile() {
        return this.http.get<any>('http://api.telecom-car.uz/user/profile')
            .subscribe(data => {
                if (data.name) {
                    const user = this.currentUser.getValue();
                    user.setProfile(
                        data.name,
                        data.last_name,
                        data.father_name,
                        data.subdivision,
                        data.position,
                        data.main_phone,
                        data.main_address,
                        data.phones,
                        data.addresses,
                        data.status
                    );
                    this.currentUser.next(user);
                    return this.storage.set(CURRENT_USER, this.currentUser.getValue());
                }
            });
    }

    logout() {
        return this.storage.remove(CURRENT_USER).then(() => {
            this.currentUser.next(null);
            this.authenticationState.next(false);
        });
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }

    checkToken() {
        return this.storage.get(CURRENT_USER).then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        });
    }

    routingByRole() {
        this.getCurrentUser().subscribe(user => {
            if (user) {
                if (user.role === 'user') {
                    this.router.navigate(['user']);
                }
            } else {
                this.storage.get(CURRENT_USER).then(res => {
                    if (res) {
                        if (res.role === 'user') {
                            this.router.navigate(['user', 'main']);
                        }
                    }
                });
            }
        });
    }

    getCurrentUser() {
        return this.currentUser.asObservable();
    }

}
