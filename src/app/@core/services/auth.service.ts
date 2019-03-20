import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, pass: string, client_id: string, client_secret: string) {
    const body = JSON.stringify({grant_type: 'password', username: username, password: pass, client_id: client_id, client_secret: client_secret});

    // return this.http.post<any>(`http://api.telecom-car.uz/oauth2/token`, body, {
    return this.http.post<any>(`http://localhost:1337/api.telecom-car.uz/oauth2/token`, body, {
      headers: {'Content-Type': 'application/json'}
    }).pipe(map(data => {
        if (data && data.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        return data;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
