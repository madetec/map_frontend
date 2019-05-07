import {EventEmitter, Injectable} from '@angular/core';
import {User} from '../models/user';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class AuthService {
    // new
    authState = new BehaviorSubject(false);
    // old
    public user: User;
    public firebaseToken;
    public text: any;
    onLoginIncorrect = new EventEmitter<string>();

  constructor(
      private http: HttpClient,
      private router: Router
  ) {
      if (localStorage.getItem('currentUser')) {
          this.user = new User(JSON.parse(localStorage.getItem('currentUser')));
      } else {
          this.user = new User();
      }
  }

    public get getCurrentUser(): User {
        return this.user;
    }

    login(username: string, password: string) {
        let url = 'http://api.telecom-car.uz/oauth2/token';
        let data = this.authRequestData(username, password);
        let options = {headers: {'Content-Type': 'application/json'}};
        return this.http.post<any>(url, data, options)
            .pipe(map(data => {
                if (data && data.access_token) {
                    this.user.setAuthData(
                        username,
                        data.access_token,
                        data.expires_in,
                        data.token_type,
                        data.scope,
                        data.refresh_token
                    );
                }
            }));
    }

    getUserRole() {
        return this.http.get<any>('http://api.telecom-car.uz/user/role')
            .pipe(map(data => {
                if (data && data.role) {
                    this.user.setRole(data.role, data.roleName);
                }
            }));
    }

    getProfile() {
        return this.http.get<any>('http://api.telecom-car.uz/user/profile')
            .pipe(map((data) => {
                if (data.name) {
                    this.user.setProfile(
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
                }
            }));
    }

    setFirebaseToken(): void {
        let firebase_data = localStorage.getItem('firebase_data');
        firebase_data = JSON.parse(firebase_data);
        let response = this.http.post <any>(`http://api.telecom-car.uz/device/add`, firebase_data);
        response.subscribe();
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.user = new User();
        this.router.navigateByUrl('/login');
    }

    getTextCurrentLocation(geocode) {
        if (Array.isArray(geocode)) {
            geocode = geocode.join();
        } else if (typeof geocode === 'string') {
            geocode = geocode.split(/ /g).join('+');
        }
        return this.http.get<any>('https://geocode-maps.yandex.ru/1.x/', {
            params: {
                apiKey: '28dabf92-4d44-4291-a67b-ebee0a411fb2',
                format: 'json',
                geocode: geocode
            }
        }).pipe(map(data => {
            if (data) {
                return data.response;
            }
            return null;
        }));
    }

    private authRequestData(username: string, password: string) {
        return {
            grant_type: 'password',
            username: username,
            password: password,
            client_id: 'testclient',
            client_secret: 'testpass'
        };
    }

    redirect() {
        if (this.user) {
            if (this.user.role === 'user') {
                this.router.navigate(['/____main-user']);
            } else if (this.user.role === 'driver') {
                this.router.navigate(['/____main-driver']);
            }
        }
    }
}