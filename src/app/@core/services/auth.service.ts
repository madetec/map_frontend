import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../models/user';

import {Device} from '@ionic-native/device/ngx';
import {FcmService} from './fcm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  private currentRoleSubject: BehaviorSubject<string>;
  public currentUser: Observable<User>;
  public currentRole: Observable<string>;
    public firebaseToken;
  onLoginIncorrect = new EventEmitter<string>();

    constructor(
        private http: HttpClient,
        private device: Device,
        private fcm: FcmService,
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentRoleSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentUserRole')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentRole = this.currentRoleSubject.asObservable();
    }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserRole(): String {
    return this.currentRoleSubject.value;
  }


    login(username: string, pass: string, client_id: string, client_secret: string) {
    const body = JSON.stringify({grant_type: 'password', username: username, password: pass, client_id: client_id, client_secret: client_secret});

    return this.http.post<any>(`http://api.telecom-car.uz/oauth2/token`, body, {
      headers: {'Content-Type': 'application/json'}
    }).pipe(map(data => {
        if (data && data.access_token) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        return data;
      }));
  }

  getUserRole() {
    return this.http.get<any>(`http://api.telecom-car.uz/user/role`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.currentUserSubject.value.access_token}`}
    }).pipe(map(data => {
      if (data && data.role) {
        localStorage.setItem('currentUserRole', JSON.stringify(data.role));
        this.currentRoleSubject.next(data.role);
      }
      return data;
    }));
  }

    setFirebaseToken(): void {
        this.fcm.getToken();
        let firebase_token = localStorage.getItem('firebase_token');
        alert(firebase_token);
        if(firebase_token != 'undefined'){
            firebase_token = JSON.parse(firebase_token);
            alert(firebase_token);
            let data = {
                uid: this.device.uuid,
                firebase_token: firebase_token,
                name: this.device.platform + ', ' + this.device.version
            };
            let response = this.http.post<any>(`http://api.telecom-car.uz/device/add`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.currentUserSubject.value.access_token}`
                }
            }).pipe(map(data => {
              return data;
            }));
            response.subscribe(res => {
              alert(JSON.stringify(res));
            });
            
        }
    }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserRole');
    this.currentUserSubject.next(null);
    this.currentRoleSubject.next(null);
  }
}
