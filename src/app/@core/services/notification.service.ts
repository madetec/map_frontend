import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get('http://api.telecom-car.uz/notifications');
    }
}
