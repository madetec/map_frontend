import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, pass: string, client_id: string, client_secret: string) {
    const body = JSON.stringify({grant_type: 'password', username: username, password: pass, client_id: client_id, client_secret: client_secret});

    return this.http.post<any>(`http://api.telecom-car.uz/oauth2/token`, body, {
      headers: {'Content-Type': 'application/json'}
    })
      // .pipe(map(data => {
      //     // if (data && data.state == 1) {
      //     //   localStorage.setItem('currentUser', JSON.stringify(data));
      //     // }
      //     return data;
      //   }),
      //   catchError(err => {
      //     console.log(err);
      //     return throwError(err);
      //   }));
  }
}
