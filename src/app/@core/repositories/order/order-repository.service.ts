import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/index';
import {User} from '../../models/user';


@Injectable({
    providedIn: 'root'
})
export class OrderRepositoryService {
    private currentUserSubject: BehaviorSubject < User > ;
    constructor(
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject < User > (JSON.parse(localStorage.getItem('currentUser')));
    }

    getOrders() {
        return this.http.get < any > ('http://api.telecom-car.uz/user/order', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.currentUserSubject.value.access_token}`
            }
        });
    }
}
