import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class OrderRepositoryService {
    constructor(
        private http: HttpClient
    ) {
    }

    getOrders() {
        return this.http.get <any>('http://api.telecom-car.uz/user/order');
    }

    createOrder(data) {
        return this.http.post <any>('http://api.telecom-car.uz/user/order', data);
    }
}
