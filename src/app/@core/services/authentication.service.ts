import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Platform} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {Device} from '@ionic-native/device/ngx';

const CURRENT_USER = 'current user';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    authenticationState = new BehaviorSubject(false);
    currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    onLoginIncorrect = new EventEmitter<string>();
    currentMenu = new BehaviorSubject(null);

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private platform: Platform,
        private device: Device,
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
                return this.storage.set(CURRENT_USER, this.currentUser.value).then(() => {
                    this.getRole();
                    this.getProfile();
                });
            }
        });
    }

    getRole() {
        const user = this.currentUser.getValue();
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${user.token_type} ${user.access_token}`
            }
        };
        return this.http.get<any>('http://api.telecom-car.uz/user/role', options)
            .subscribe(data => {
                if (data && data.role) {
                    user.setRole(data.role, data.name);
                    this.currentMenu.next(data.role);
                    this.currentUser.next(user);
                    return this.storage.set(CURRENT_USER, this.currentUser.value);
                }
            });
    }

    getProfile() {
        const user = this.currentUser.getValue();
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${user.token_type} ${user.access_token}`
            }
        };
        return this.http.get<any>('http://api.telecom-car.uz/user/profile', options)
            .subscribe(data => {
                if (data.name) {
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
                    return this.storage.set(CURRENT_USER, this.currentUser.value).then(() => {
                        this.authenticationState.next(true);
                    });
                }
            });
    }

    logout() {
        return this.storage.remove(CURRENT_USER).then(() => {
            this.currentUser.next(null);
            this.currentMenu.next(null);
            this.authenticationState.next(false);
        });
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }

    checkToken() {
        return this.storage.get(CURRENT_USER).then(res => {
            if (res) {
                this.currentMenu.next(res.role);
                this.currentUser.next(res);
                this.authenticationState.next(true);
            }
        });
    }

    initMenuByRole() {
        if (this.isUser(this.currentMenu.value)) {
            return this.userMenu();
        } else if (this.isDriver(this.currentMenu.value)) {
            return this.driverMenu();
        }
    }

    routingByRole() {
        return this.storage.get(CURRENT_USER).then(res => {
            if (res) {
                if (this.isUser(res.role)) {
                    this.router.navigate(['user']);
                } else if (res.role === 'driver') {
                    this.router.navigate(['driver']);
                } else {
                    this.logout();
                        }
                    }
        });

    }

    getCurrentUser() {
        return this.currentUser.asObservable();
    }

    refreshToken() {
        this.getCurrentUser().subscribe(user => {
            if (!user) {
                this.storage.get(CURRENT_USER).then(res => {
                    this.currentUser.next(res);
                });
            }
        });
        const user = this.currentUser.getValue();
        const data = {
            grant_type: 'refresh_token',
            refresh_token: user.refresh_token,
            client_id: 'testclient',
            client_secret: 'testpass'
        };
        const url = 'http://api.telecom-car.uz/oauth2/token';
        const options = {headers: {'Content-Type': 'application/json'}};
        return this.http.post<any>(url, data, options).subscribe(response => {
            if (response.access_token) {
                user.access_token = response.access_token;
                user.expires_in = response.expires_in;
                this.currentUser.next(user);
                return this.storage.set(CURRENT_USER, this.currentUser.value);
            }
        });
    }

    private userMenu(): object[] {

        return [
            {
                title: 'Главная',
                url: '/user',
                icon: 'pin'
            },
            {
                title: 'Профиль',
                url: '/user/profile',
                icon: 'contact'
            },
            {
                title: 'История поездок',
                url: '/user/order',
                icon: 'filing'
            },
            {
                title: 'Оповещания',
                url: '/user/notification',
                icon: 'notifications-outline'
            },
            {
                title: 'Поддержка',
                url: '/help',
                icon: 'help-circle-outline'
            }
        ];
    }

    private driverMenu(): object[] {
        return [
            {
                title: 'Главная',
                url: '/driver',
                icon: 'pin'
            },
            {
                title: 'Профиль',
                url: '/driver/profile',
                icon: 'contact'
            },
            {
                title: 'История поездок',
                url: '/driver/order',
                icon: 'filing'
            },
            {
                title: 'Оповещания',
                url: '/driver/notification',
                icon: 'notifications-outline'
            },
            {
                title: 'Поддержка',
                url: '/help',
                icon: 'help-circle-outline'
            }
        ];
    }

    private isUser(role: string): boolean {
        return role === 'user';
    }

    private isDriver(role: string): boolean {
        return role === 'driver';
    }

    setFirebaseToken(token) {
        return this.http.post<any>('http://api.telecom-car.uz/device/add', {
            uid: this.device.uuid,
            firebase_token: token,
            name: this.device.platform
        }).subscribe(() => {
        });
    }
}
